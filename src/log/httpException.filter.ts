import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : (exception as Error).message;

    const log = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
    };

    this.loggingService.error(JSON.stringify(log));

    response.status(status).json({
      statusCode: status,
      timestamp: log.timestamp,
      path: request.url,
      message,
    });
  }
}
