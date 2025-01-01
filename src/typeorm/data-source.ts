import { DataSource } from 'typeorm';
import { isRunningInContainer } from 'src/common/utils/isRunningInContainer';
import { loadEnv } from 'src/common/utils/load.env';
import { AppNamingStrategy } from './naming-strategy';

if (!isRunningInContainer()) loadEnv();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./dist/**/*.model.js'],
  migrations: ['./dist/typeorm/migrations/*.js'],
  migrationsTableName: '_typeorm_migrations',
  namingStrategy: new AppNamingStrategy(),
  schema: process.env.DATABASE_SCHEMA,
});
