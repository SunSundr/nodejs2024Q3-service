import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
// import { AppModule } from './app.module';
import { AppService } from './app.service';
import { LogService } from './log/log.service';
import { runSwagger } from './common/swagger/runSwagger';
import { APP_NAME, SWAGGER_PATH } from './app.config';
import { COLOR, colorString } from './common/utils/color';
import { OrmTypes, validateEnv } from './common/utils/validate.env';
import { isRunningInContainer } from './common/utils/isRunningInContainer';
import { migrationGenerate } from './typeorm/migration.generate';

async function bootstrap() {
  if (!isRunningInContainer()) {
    await ConfigModule.forRoot({ validate: validateEnv });
    if (process.env.ORM_TYPE !== OrmTypes.MEMORY) {
      await (
        await import('./db/init')
      ).default;
      if (process.env.ORM_TYPE === OrmTypes.TYPEORM) {
        migrationGenerate({ clearOldMigrations: true });
      }
    }
  }
  const { AppModule } = await import('./app.module');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  try {
    const logger = app.get(LogService);
    await logger.init();
    app.useLogger(logger);

    const port = app.get(ConfigService)?.get('PORT');
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

    // app.enableShutdownHooks();

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
