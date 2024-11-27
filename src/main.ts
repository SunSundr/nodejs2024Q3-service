import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { LogService } from './log/log.service';
import { runSwagger } from './common/swagger/runSwagger';
import { APP_NAME, SWAGGER_PATH } from './app.config';
import { COLOR, colorString } from './common/utils/color';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  try {
    app.useLogger(app.get(LogService));

    const port = app.get(ConfigService)?.get<number>('PORT');
    if (!port) throw new Error('PORT environment variable is not defined.');

    app.use((_req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Content-Type', 'application/json'); // 'text/html'
      // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      // res.setHeader('Pragma', 'no-cache');
      // res.setHeader('Expires', '0');
      // res.setHeader('Surrogate-Control', 'no-store');
      next();
    });

    app.get(AppService)?.setApp(app);
    runSwagger(app);

    await app.listen(port);

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
