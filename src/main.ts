import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const port = process.env.PORT;

  if (!port) {
    console.error('PORT environment variable is not defined.');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  try {
    await app.listen(parseInt(port, 10));
    console.log(`Application is running on: ${await app.getUrl()}`);
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
