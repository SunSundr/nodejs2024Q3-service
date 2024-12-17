import { INestApplication } from '@nestjs/common';
import { ConfigObject } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { APP_NAME, SWAGGER_PATH } from 'src/app.config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';


export function runSwagger(app: INestApplication, configService: ConfigObject): void {
  let document: OpenAPIObject;
  if (configService.get('SWAGGER_USE_STATIC_SCHEMA') === 'true') {
    const swaggerYaml = readFileSync(resolve(cwd(), 'doc', 'api.yaml'), 'utf8');
    document = parse(swaggerYaml);
  } else {
    const config = new DocumentBuilder()
      .setTitle(APP_NAME)
      .setDescription('Home music library service API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    document = SwaggerModule.createDocument(app, config);
  }
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}
