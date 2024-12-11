import { Injectable, ConsoleLogger, Inject, OnApplicationShutdown } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs/promises';
import { createWriteStream, WriteStream } from 'fs';
import { finished } from 'stream/promises';
import { processErrors } from './process.errors';
import { LOG_DEFAULT } from 'src/app.config';
import { APP_CONFIG_SERVICE, AppConfigService } from 'src/app.config.service';

export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export const PRIORITY_LEVELS = [
  LogLevel.FATAL,
  LogLevel.ERROR,
  LogLevel.WARN,
  LogLevel.LOG,
  LogLevel.DEBUG,
  LogLevel.VERBOSE,
];

export const LOG_DIR = join(__dirname, `../../${LOG_DEFAULT.logFolder}`);

const KB = 1024;
const MB = 1024 * KB;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface LogData {
  size: number;
  stream: WriteStream;
}

export interface LogFiles {
  app?: LogData;
  err?: LogData;
}

export interface FilesData {
  name: string;
  size: number;
  mtimeMs: number;
}

@Injectable()
export class LogService extends ConsoleLogger implements OnApplicationShutdown {
  private currentLogLevel: number;
  private verboseStack: boolean;

  private maxFileSize: number;
  private maxFolderSize: number;
  private targetSize: number;
  private maxFileAge: number;
  private logFolderSize = 0;

  private filesCache: FilesData[] = [];
  private scheduler?: NodeJS.Timeout;

  private logFile = {} as LogData;
  private errFile = {} as LogData;

  private errorDetected = false;
  private isCleaning = false;

  constructor(@Inject(APP_CONFIG_SERVICE) private readonly appConfigService: AppConfigService) {
    super();
  }

  onApplicationShutdown(_signal: string) {
    this.close();
  }

  async init(): Promise<void> {
    try {
      this.initConfig();
      await fs.mkdir(LOG_DIR, { recursive: true });

      const logFiles = await this.findLatestLogFiles();
      const time = Date.now();

      if (logFiles.app && logFiles.app.size < this.maxFileSize) {
        this.logFile = logFiles.app;
      } else {
        await this.updateLogData(this.logFile, time);
      }

      if (logFiles.err && logFiles.err.size < this.maxFileSize) {
        this.errFile = logFiles.err;
      } else {
        await this.updateLogData(this.errFile, time);
      }

      await this.cleanOldLogs();

      this.initScheduler();

      processErrors(this);
    } catch (err) {
      this.handleError('Error creating logs directory', err);
    }
  }

  initConfig(): void {
    this.errorDetected = false;
    this.currentLogLevel = this.appConfigService.getInteger('LOG_LEVEL', LOG_DEFAULT.logLevel);
    this.maxFileSize =
      this.appConfigService.getInteger('LOG_FILE_MAX_SIZE_KB', LOG_DEFAULT.fileMaxSizeKB) * KB;
    this.maxFolderSize =
      this.appConfigService.getInteger('MAX_FOLDER_SIZE_MB', LOG_DEFAULT.folderMaxSizeMB) * MB;
    this.targetSize =
      this.maxFolderSize *
      (1 - this.appConfigService.getInteger('CLEANUP_PERCENT', LOG_DEFAULT.claenupPercent) / 100);
    this.maxFileAge =
      this.appConfigService.getInteger('MAX_FILE_AGE_DAYS', LOG_DEFAULT.maxFileAgeDays) * DAY_MS;
    this.verboseStack = this.appConfigService.getBoolean('LOG_VERBOSE_STACK', false);
  }

  initScheduler(): void {
    if (this.scheduler) clearInterval(this.scheduler);
    this.scheduler = setInterval(async () => {
      if (this.isCleaning) return;
      this.isCleaning = true;
      try {
        console.log('Running periodic log cleanup...');
        await this.cleanOldLogs();
      } finally {
        this.isCleaning = false;
      }
    }, this.maxFileAge);
  }

  async close(): Promise<void> {
    try {
      if (this.logFile.stream) await finished(this.logFile.stream);
      if (this.errFile.stream) await finished(this.errFile.stream);
    } catch (err) {
      console.error('Error closing log streams:', err.message);
    }
  }

  private handleError(message: string, error: Error): void {
    this.errorDetected = true;
    console.error(`${message}: ${error.message}`);
  }

  private createNewStream(path: string): WriteStream {
    const stream = createWriteStream(path, { flags: 'a' });
    stream.on('error', (err) => this.handleError(`Stream error for file ${path}`, err));
    return stream;
  }

  private async sortFilesByCreationTime(files: string[]): Promise<FilesData[]> {
    const getMtime = async (file: string): Promise<{ size: number; mtimeMs: number }> => {
      try {
        const stat = await fs.stat(join(LOG_DIR, file));
        this.logFolderSize += stat.size;
        return { size: stat.size, mtimeMs: stat.mtimeMs };
      } catch (err) {
        console.error('Error reading file stat:', err.message);
        return { size: 0, mtimeMs: -1 };
      }
    };
    const fileStats = await Promise.all(
      files.map(async (file) => ({
        name: file,
        ...(await getMtime(file)),
      })),
    );

    return fileStats.sort((a, b) => b.mtimeMs - a.mtimeMs);
  }

  private async findLatestLogFiles(): Promise<LogFiles> {
    const allLogFiles = await fs.readdir(LOG_DIR);
    this.filesCache = await this.sortFilesByCreationTime(allLogFiles);
    const sortedLogFiles = this.filesCache.filter((fileData) =>
      fileData.name.includes(LOG_DEFAULT.logFileName),
    );
    const sortedErrFiles = this.filesCache.filter((fileData) =>
      fileData.name.includes(LOG_DEFAULT.errorFileName),
    );

    const setFiles = async (files: FilesData[]): Promise<LogData | undefined> => {
      for (let i = 0; i < files.length; i++) {
        const path = join(LOG_DIR, files[i].name);
        const size = files[i].size;
        try {
          const stream = this.createNewStream(path);
          return { size, stream };
        } catch (err) {
          console.error('Error reading file size:', err.message);
        }
      }
      return undefined;
    };

    const [app, err] = await Promise.all([setFiles(sortedLogFiles), setFiles(sortedErrFiles)]);
    return { app, err };
  }

  private async enforceFolderSizeLimit() {
    for (const fileToDelete of this.filesCache) {
      if (this.logFolderSize <= this.targetSize) break;
      await fs.unlink(join(LOG_DIR, fileToDelete.name));
      this.logFolderSize -= fileToDelete.size;
      console.log(`Deleted log to free space: ${fileToDelete.name}`);
    }
  }

  private async cleanOldLogs() {
    const cutoff = Date.now() - this.maxFileAge;
    const oldFiles = this.filesCache.filter((file) => file.mtimeMs < cutoff);

    for (const file of oldFiles) {
      await fs.unlink(join(LOG_DIR, file.name));
      this.logFolderSize -= file.size;
      this.removeFileFromCache(file.name);
      console.log(`Deleted old log: ${file.name}`);
    }
  }

  private async updateLogData(fileData: LogData, time?: number): Promise<void> {
    const timestamp = time || Date.now();
    const fname = `${
      fileData === this.logFile ? LOG_DEFAULT.logFileName : LOG_DEFAULT.errorFileName
    }-${timestamp}.${LOG_DEFAULT.logExtName}`;
    fileData.size = 0;
    fileData.stream = this.createNewStream(join(LOG_DIR, fname));
    await this.enforceFolderSizeLimit();
    this.filesCache.push({ name: fname, size: fileData.size, mtimeMs: timestamp });
  }

  private removeFileFromCache(fileName: string): void {
    this.filesCache = this.filesCache.filter((file) => file.name !== fileName);
  }

  private async logToFile(fileData: LogData, message: string): Promise<void> {
    if (this.errorDetected) return;
    const writeError = (err: Error) => this.handleError('Error writing to log file', err);
    try {
      // const addition = Buffer.from(message).length;
      const addition = Buffer.byteLength(message, 'utf8');
      if (fileData.size + addition > this.maxFileSize) {
        fileData.stream.end();
        await this.updateLogData(fileData);
      }
      fileData.size += addition;
      fileData.stream.write(message, 'utf-8', (err) => {
        if (err) writeError(err);
      });
    } catch (err) {
      writeError(err);
    }
  }

  private formatLogMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] ${level.toUpperCase()}:${contextStr} ${message}\n`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levelIndex = PRIORITY_LEVELS.indexOf(level);
    return levelIndex !== -1 && levelIndex <= this.currentLogLevel;
  }

  async log(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.LOG)) return;
    const formatted = this.formatLogMessage(LogLevel.LOG, message, context);
    super.log(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async error(message: string, stack?: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formattedMessage = this.verboseStack ? `${message} - ${stack || ''}` : message;

    const formatted = this.formatLogMessage(LogLevel.ERROR, formattedMessage, context);
    super.error(message || '', this.verboseStack ? stack : undefined, context || '');
    await Promise.all([
      this.logToFile(this.logFile, formatted),
      this.logToFile(this.errFile, formatted),
    ]);
  }

  async warn(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formatted = this.formatLogMessage(LogLevel.WARN, message, context);
    super.warn(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async debug(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formatted = this.formatLogMessage(LogLevel.DEBUG, message, context);
    super.debug(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async verbose(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;

    const formatted = this.formatLogMessage(LogLevel.VERBOSE, message, context);
    super.verbose(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async logRequest(req: Request, id?: string): Promise<void> {
    const logParts: string[] = [`"id":"${id || req['id']}"`];
    if (req['userId']) logParts.push(`"userId":"${req['userId']}"`);

    logParts.push(`"method":"${req.method}"`, `"url":"${req.url}"`);

    const bodyString = JSON.stringify(req.body);
    if (bodyString.length !== 2) logParts.push(`"body": ${bodyString}`);

    const queryString = JSON.stringify(req.query);
    if (queryString.length !== 2) logParts.push(`"query": ${queryString}`);

    await this.log(`{${logParts.join(', ')}}`, 'REQUEST');
  }

  async logResponse(res: Response, id?: string, duration?: number): Promise<void> {
    const formatDuration = duration ? ` [${duration}ms]` : '';
    await this.log(
      `{"id":"${id || res['id']}", "statusCode": ${res.statusCode}} ${formatDuration}`,
      'RESPONSE',
    );
  }
}
