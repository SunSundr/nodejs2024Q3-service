// import { loadEnv } from 'src/common/utils/load.env';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

function checkEnvVariables(variables: string[]): void {
  const missingVariables = variables.filter((variable) => !process.env[variable]);
  if (missingVariables.length > 0) {
    console.error(
      `Error: The following environment variables are missing: ${missingVariables.join(', ')}`,
    );
    process.exit(1);
  }
}

const requiredEnvVariables = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_SCHEMA',
];

checkEnvVariables(requiredEnvVariables);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./dist/**/*.model.js'],
  migrations: ['./dist/typeorm/migrations/*.js'],
  migrationsRun: true,
  schema: process.env.DATABASE_SCHEMA,
  dropSchema: process.env.TYPEORM_DROPSCHEMA === 'true',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
};
