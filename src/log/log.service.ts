import { Injectable, ConsoleLogger } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs/promises';
import { processErrors } from './process.errors';
import { LOG_DEFAULT } from 'src/app.config';

enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable()
export class LogService extends ConsoleLogger {
  private readonly logDir = join(__dirname, `../../${LOG_DEFAULT.logFolder}`);
  private readonly logFilePath = join(this.logDir, LOG_DEFAULT.logFileName);
  private readonly errorLogFilePath = join(this.logDir, LOG_DEFAULT.errorFileName);
  private readonly maxFileSizeKB =
    Number(process.env.LOG_FILE_MAX_SIZE_KB) || LOG_DEFAULT.fileMaxSizeKB;
  private readonly levels = [
    LogLevel.FATAL,
    LogLevel.ERROR,
    LogLevel.WARN,
    LogLevel.LOG,
    LogLevel.DEBUG,
    LogLevel.VERBOSE,
  ];
  private readonly currentLogLevel = process.env.LOG_LEVEL
    ? Number(process.env.LOG_LEVEL)
    : LOG_DEFAULT.logLevel;
  private readonly verboseStack = process.env.LOG_VERBOSE_STACK === 'true';

  constructor() {
    super();
    processErrors(this);
    this.ensureLogDirectory();
    this.ensureLogFiles();
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (err) {
      console.error('Error creating logs directory:', err.message);
    }
  }

  private async ensureLogFiles(): Promise<void> {
    try {
      await fs.appendFile(this.logFilePath, '');
      await fs.appendFile(this.errorLogFilePath, '');
    } catch (err) {
      console.error('Error initializing log files:', err.message);
    }
  }

  private async rotateLogFile(filePath: string): Promise<void> {
    const stats = await fs.stat(filePath).catch(() => null);
    if (stats && stats.size / 1024 >= this.maxFileSizeKB) {
      const rotatedPath = filePath.replace('.log', `-${Date.now()}.log`);
      try {
        await fs.rename(filePath, rotatedPath);
      } catch {
        // Suppressed error during log rotation, as it resolves itself and data is not lost
      }
      await fs.appendFile(filePath, '');
    }
  }

  private async logToFile(filePath: string, message: string): Promise<void> {
    try {
      await fs.appendFile(filePath, message);
      await this.rotateLogFile(filePath);
    } catch (err) {
      console.error('Error writing to log file:', err.message);
    }
  }

  private formatLogMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levelIndex = this.levels.indexOf(level);
    return levelIndex !== -1 && levelIndex <= this.currentLogLevel;
  }

  async log(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.LOG)) return;
    const formatted = this.formatLogMessage(LogLevel.LOG, message);
    super.log(message || '', context || '');
    await this.logToFile(this.logFilePath, formatted);
  }

  async error(message: string, stack?: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formattedMessage = this.verboseStack ? `${message} - ${stack || ''}` : message;

    const formatted = this.formatLogMessage(LogLevel.ERROR, formattedMessage);
    super.error(message || '', this.verboseStack ? stack : undefined, context || '');
    await this.logToFile(this.logFilePath, formatted);
    await this.logToFile(this.errorLogFilePath, formatted);
  }

  async warn(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formatted = this.formatLogMessage(LogLevel.WARN, message);
    super.warn(message || '', context || '');
    await this.logToFile(this.logFilePath, formatted);
  }

  async debug(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formatted = this.formatLogMessage(LogLevel.DEBUG, message);
    super.debug(message || '', context || '');
    await this.logToFile(this.logFilePath, formatted);
  }

  async verbose(message: string, context?: string): Promise<void> {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;

    const formatted = this.formatLogMessage(LogLevel.VERBOSE, message);
    super.verbose(message || '', context || '');
    await this.logToFile(this.logFilePath, formatted);
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
