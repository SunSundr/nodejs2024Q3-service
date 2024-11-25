import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { runSwagger } from './common/swagger/runSwagger';
import { APP_NAME, SWAGGER_PATH } from './app.config';
import { COLOR, colorString } from './common/utils/color';
import { AppService } from './app.service';
import { loadEnv } from './common/utils/load.env';
import { LogService } from './log/log.service';
// import { LoggingService } from './log/logging.service';
// import { HttpExceptionFilter } from './log/httpException.filter';

async function bootstrap() {
  await loadEnv('PORT');
  const port = process.env.PORT;

  if (!port) {
    console.error('PORT environment variable is not defined.');
    process.exit(1);
  }

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(LogService);
  app.useLogger(logger);
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json'); // 'text/html'
    // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    // res.setHeader('Pragma', 'no-cache');
    // res.setHeader('Expires', '0');
    // res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // const loggingService = app.get(LoggingService);
  // app.useGlobalFilters(new HttpExceptionFilter(loggingService));

  const appService = app.get(AppService);
  appService.setApp(app);

  try {
    runSwagger(app);
    await app.listen(parseInt(port, 10));
    console.log(
      '-'.repeat(80),
      `\n\uD83C\uDF10 ${APP_NAME} is running on: ${colorString(COLOR.cyan, await app.getUrl())}`,
    );
    console.log(
      `\uD83C\uDF10 Swagger is running on: ${colorString(
        COLOR.cyan,
        `http://localhost:${port}/${SWAGGER_PATH}`,
      )}`,
    );
  } catch (error) {
    console.error(
      `Failed to start the application: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
    process.exit(1);
  }
}

bootstrap();
