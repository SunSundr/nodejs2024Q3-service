import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { loadEnv } from 'src/common/utils/load.env';
import { processErrors } from './process.errors';

loadEnv();

export enum LogLevels {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

@Injectable()
export class LoggingService {
  private logFilePath = join(__dirname, '../../logs/app.log');
  private maxFileSizeKB = Number(process.env.LOG_FILE_MAX_SIZE_KB) || 512;
  private logLevels = [LogLevels.ERROR, LogLevels.WARN, LogLevels.INFO, LogLevels.DEBUG];
  private logLevel =
    this.logLevels.indexOf(process.env.LOGGING_LEVEL as LogLevels) > -1
      ? (process.env.LOGGING_LEVEL as LogLevels)
      : LogLevels.INFO;

  constructor() {
    this.ensureLogFile();
    processErrors(this);
  }

  private async ensureLogFile(): Promise<void> {
    try {
      await fs.appendFile(this.logFilePath, '');
    } catch (err) {
      console.error('Error initializing log file:', err.message);
    }
  }

  private async rotateLogFile(): Promise<void> {
    try {
      const stats = await fs.stat(this.logFilePath);
      const fileSizeInKB = stats.size / 1024;

      if (fileSizeInKB > this.maxFileSizeKB) {
        const rotatedPath = this.logFilePath.replace('.log', `-${Date.now()}.log`);
        await fs.rename(this.logFilePath, rotatedPath);
        await this.ensureLogFile();
      }
    } catch (err) {
      console.error('Error rotating LOG file:', err.message);
    }
  }

  private shouldLog(level: LogLevels): boolean {
    return this.logLevels.indexOf(level) <= this.logLevels.indexOf(this.logLevel);
  }

  private async logToFile(level: string, message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;

    try {
      await fs.appendFile(this.logFilePath, logMessage);
      await this.rotateLogFile();
    } catch (err) {
      console.error('Error writing to LOG file:', err.message);
    }
  }

  async log(msg: string): Promise<void> {
    if (this.shouldLog(LogLevels.INFO)) await this.logToFile(LogLevels.INFO, msg);
  }

  async error(msg: string): Promise<void> {
    if (this.shouldLog(LogLevels.ERROR)) await this.logToFile(LogLevels.ERROR, msg);
  }

  async warn(msg: string): Promise<void> {
    if (this.shouldLog(LogLevels.WARN)) await this.logToFile(LogLevels.WARN, msg);
  }

  async debug(msg: string): Promise<void> {
    if (this.shouldLog(LogLevels.DEBUG)) await this.logToFile(LogLevels.DEBUG, msg);
  }
}
