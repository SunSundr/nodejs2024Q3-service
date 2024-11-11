import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { APP_NAME, SWAGGER_PATH, SWAGGER_USE_DEFAULT_SCHEMA } from 'src/app.config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

export function runSwagger(app: INestApplication): void {
  let document: OpenAPIObject;
  if (SWAGGER_USE_DEFAULT_SCHEMA) {
    const swaggerYaml = readFileSync('./doc/api.yaml', 'utf8');
    document = yaml.load(swaggerYaml) as OpenAPIObject;
  } else {
    const config = new DocumentBuilder()
      .setTitle(APP_NAME)
      .setDescription('Home music library service API')
      .setVersion('1.0.0')
      .build();
    document = SwaggerModule.createDocument(app, config);
  }
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}
