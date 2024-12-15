import { AbstractLogger, LogLevel, LogMessage } from 'typeorm';
import { LogService } from 'src/log/log.service';

export class TypeORMLogger extends AbstractLogger {
  constructor(private readonly logService: LogService) {
    super('all'); // "query" | "schema" | "error" | "warn" | "info" | "log" | "migration"
  }

  protected writeLog(
    level: LogLevel,
    logMessage: LogMessage | LogMessage[],
    //queryRunner?: QueryRunner,
  ) {
    const messagesRaw = (Array.isArray(logMessage) ? logMessage : [logMessage]).map(
      (msgObj) => msgObj.message,
    );
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: true,
      // appendParameterAsComment: true,
      // addColonToPrefix: true;
    });
    for (let i = 0; i < messages.length; i++) {
      const messageObj = messages[i];
      const prefix = messageObj.prefix ? `${messageObj.prefix} ` : '';
      const logOptions = { msgRaw: prefix + messagesRaw[i] };
      const message = prefix + messageObj.message;
      switch (messageObj.type ?? level) {
        case 'log':
        case 'query':
          this.logService.log(message, TypeORMLogger.name, logOptions);
          break;
        case 'info':
          this.logService.debug(message, TypeORMLogger.name, logOptions);
          break;
        case 'schema-build':
        case 'migration':
          this.logService.verbose(message, TypeORMLogger.name, logOptions);
          break;
        case 'warn':
        case 'query-slow':
          this.logService.warn(message, TypeORMLogger.name, logOptions);
          break;
        case 'error':
        case 'query-error':
          this.logService.error(message, undefined, TypeORMLogger.name, logOptions);
          break;
      }
    }
  }
}
