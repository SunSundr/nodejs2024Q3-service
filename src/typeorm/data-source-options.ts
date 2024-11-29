// import { loadEnv } from 'src/common/utils/load.env';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// import * as dotenv from 'dotenv';
// dotenv.config();

// function checkEnvVariables(variables: string[]): void {
//   const missingVariables = variables.filter((variable) => !process.env[variable]);
//   if (missingVariables.length > 0) {
//     console.error(
//       `Error: The following environment variables are missing: ${missingVariables.join(', ')}`,
//     );
//     process.exit(1);
//   }
// }

// const requiredEnvVariables = [
//   'DATABASE_HOST',
//   'DATABASE_PORT',
//   'DATABASE_USER',
//   'DATABASE_PASSWORD',
//   'DATABASE_NAME',
//   'DATABASE_SCHEMA',
// ];

// checkEnvVariables(requiredEnvVariables);

export const getDataSourceOptions = async (
  configService: ConfigService,
): Promise<DataSourceOptions> => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: +configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: ['./dist/**/*.model.js'],
  migrations: ['./dist/typeorm/migrations/*.js'],
  migrationsRun: true,
  schema: configService.get<string>('DATABASE_SCHEMA'),
  dropSchema: configService.get<boolean>('TYPEORM_DROPSCHEMA', false),
  synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE', false),
  logging: configService.get<boolean>('TYPEORM_LOGGING'),
});
