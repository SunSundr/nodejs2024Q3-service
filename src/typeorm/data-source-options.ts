import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'nodejs2024q3',
  password: process.env.DATABASE_PASSWORD || '5106',
  database: process.env.DATABASE_NAME || 'nodejs2024q3-typeorm',
  entities: ['./dist/**/*.model.js'],
  migrations: ['./dist/typeorm/migrations/*.js'],
  schema: 'nodejs2024schema',
  dropSchema: true,
  synchronize: true,
  logging: true,
};
