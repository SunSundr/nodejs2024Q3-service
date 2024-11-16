import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { APP_NAME, SWAGGER_PATH, SWAGGER_USE_DEFAULT_SCHEMA } from 'src/app.config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';

export function runSwagger(app: INestApplication): void {
  let document: OpenAPIObject;
  if (SWAGGER_USE_DEFAULT_SCHEMA) {
    const swaggerYaml = readFileSync(resolve(cwd(), 'doc', 'api.yaml'), 'utf8');
    document = parse(swaggerYaml);
  } else {
    const config = new DocumentBuilder()
      .setTitle(APP_NAME)
      .setDescription('Home music library service API')
      .setVersion('1.0.0')
      .build();
    document = SwaggerModule.createDocument(app, config);
  }
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.js',
    ],
  });
}
