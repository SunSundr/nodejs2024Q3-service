import { Injectable, ConsoleLogger, Inject, OnApplicationShutdown } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs/promises';
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

export interface LogData {
  path: string;
  size: number;
}

export interface LogFiles {
  app?: LogData;
  err?: LogData;
}

@Injectable()
export class LogService extends ConsoleLogger implements OnApplicationShutdown {
  private readonly currentLogLevel: number;
  private readonly maxFileSize: number;
  private readonly verboseStack: boolean;

  private logFile = {} as LogData;
  private errFile = {} as LogData;
  private errorDetected = false;

  constructor(@Inject(APP_CONFIG_SERVICE) appConfigService: AppConfigService) {
    super();
    this.currentLogLevel = appConfigService.getInteger('LOG_LEVEL', LOG_DEFAULT.logLevel);
    this.maxFileSize =
      appConfigService.getInteger('LOG_FILE_MAX_SIZE_KB', LOG_DEFAULT.fileMaxSizeKB) * 1024;
    this.verboseStack = appConfigService.getBoolean('LOG_VERBOSE_STACK', false);
  }

  onApplicationShutdown(signal: string) {
    console.log('onApplicationShutdown', signal);
  }

  async init(): Promise<void> {
    try {
      await fs.mkdir(LOG_DIR, { recursive: true });

      const logFiles = await this.findLatestLogFiles();
      const time = Date.now();

      if (logFiles.app && logFiles.app.size < this.maxFileSize) {
        this.logFile = logFiles.app;
      } else {
        this.updateLogData(this.logFile, time);
      }

      if (logFiles.err && logFiles.err.size < this.maxFileSize) {
        this.errFile = logFiles.err;
      } else {
        this.updateLogData(this.errFile);
      }

      processErrors(this);
    } catch (err) {
      this.errorDetected = true;
      console.error('Error creating logs directory:', err.message);
    }
  }

  private async sortFilesByCreationTime(files: string[]): Promise<string[]> {
    const getMtime = async (file: string): Promise<number> => {
      try {
        return (await fs.stat(join(LOG_DIR, file))).mtimeMs;
      } catch (err) {
        console.error('Error reading file timestamp:', err.message);
        return -1;
      }
    };
    const fileStats = await Promise.all(
      files.map(async (file) => ({
        file,
        mtimeMs: await getMtime(file),
      })),
    );

    return fileStats.sort((a, b) => b.mtimeMs - a.mtimeMs).map((item) => item.file);
  }

  private async findLatestLogFiles(): Promise<LogFiles> {
    const allLogFiles = await fs.readdir(LOG_DIR);
    const logFiles = allLogFiles.filter((file) => file.includes(LOG_DEFAULT.logFileName));
    const errFiles = allLogFiles.filter((file) => file.includes(LOG_DEFAULT.errorFileName));

    const sortedLogFiles = await this.sortFilesByCreationTime(logFiles);
    const sortedErrFiles = await this.sortFilesByCreationTime(errFiles);

    const setFiles = async (files: string[]): Promise<LogData | undefined> => {
      for (let i = 0; i < files.length; i++) {
        const path = join(LOG_DIR, files[i]);
        try {
          const size = (await fs.stat(path)).size;
          return { path, size };
        } catch (err) {
          console.error('Error reading file size:', err.message);
        }
      }
      return undefined;
    };

    const result: LogFiles = {};
    result.app = await setFiles(sortedLogFiles);
    result.err = await setFiles(sortedErrFiles);
    return result;
  }

  private updateLogData(fileData: LogData, time?: number): void {
    const fname = `${time || Date.now()}-${
      fileData === this.logFile ? LOG_DEFAULT.logFileName : LOG_DEFAULT.errorFileName
    }`;
    fileData.path = join(LOG_DIR, fname);
    fileData.size = 0;
  }

  private async logToFile(fileData: LogData, message: string): Promise<void> {
    if (this.errorDetected) return;
    try {
      // const addition = Buffer.from(message).length;
      const addition = Buffer.byteLength(message, 'utf8');
      if (fileData.size + addition >= this.maxFileSize) {
        this.updateLogData(fileData);
      }
      await fs.appendFile(fileData.path, message);
      fileData.size += addition;
    } catch (err) {
      this.errorDetected = true;
      console.error('Error writing to log file:', err.message);
    }
  }

  private formatLogMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levelIndex = PRIORITY_LEVELS.indexOf(level);
    return levelIndex !== -1 && levelIndex <= this.currentLogLevel;
  }

  async log(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.LOG)) return;
    const formatted = this.formatLogMessage(LogLevel.LOG, message);
    super.log(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async error(message: string, stack?: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formattedMessage = this.verboseStack ? `${message} - ${stack || ''}` : message;

    const formatted = this.formatLogMessage(LogLevel.ERROR, formattedMessage);
    super.error(message || '', this.verboseStack ? stack : undefined, context || '');
    await this.logToFile(this.logFile, formatted);
    await this.logToFile(this.errFile, formatted);
  }

  async warn(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formatted = this.formatLogMessage(LogLevel.WARN, message);
    super.warn(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async debug(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formatted = this.formatLogMessage(LogLevel.DEBUG, message);
    super.debug(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async verbose(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;

    const formatted = this.formatLogMessage(LogLevel.VERBOSE, message);
    super.verbose(message || '', context || '');
    await this.logToFile(this.logFile, formatted);
  }

  async logRequest(req: Request, id?: string): Promise<void> {
    const { method, url, body, query } = req;
    await this.log(
      `Request-${id || req['id']}: ${method} ${url}, Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}`,
    );
  }

  async logResponse(res: Response, id?: string, duration?: number): Promise<void> {
    const formatDuration = duration ? ` [${duration}ms]` : '';
    await this.log(`Response-${id || res['id']}: statusCode: ${res.statusCode}${formatDuration}`);
  }
}
