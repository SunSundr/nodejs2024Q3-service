import { DataSourceOptions } from 'typeorm';
import { AppConfigService } from 'src/app.config.service';
import { LogService } from 'src/log/log.service';
import { TypeORMLogger } from './logger';
import { AppNamingStrategy } from './naming-strategy';

export const getDataSourceOptions = async (
  appConfigService: AppConfigService,
  logService: LogService,
): Promise<DataSourceOptions> => ({
  type: 'postgres',
  host: appConfigService.getString('DATABASE_HOST'),
  port: appConfigService.getInteger('DATABASE_PORT'),
  username: appConfigService.getString('DATABASE_USER'),
  password: appConfigService.getString('DATABASE_PASSWORD'),
  database: appConfigService.getString('DATABASE_NAME'),
  entities: ['./dist/**/*.model.js'],
  migrations: ['./dist/typeorm/migrations/*.js'],
  namingStrategy: new AppNamingStrategy(),
  migrationsRun: true,
  schema: appConfigService.getString('DATABASE_SCHEMA'),
  dropSchema: appConfigService.getBoolean('TYPEORM_DROPSCHEMA', false),
  synchronize: appConfigService.getBoolean('TYPEORM_SYNCHRONIZE', false),
  ...(appConfigService.getBoolean('ORM_LOGGING', false)
    ? { logger: new TypeORMLogger(logService) }
    : { logging: false }),
});
