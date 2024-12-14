import { DataSource } from 'typeorm';
import { isRunningInContainer } from 'src/common/utils/isRunningInContainer';
import { loadEnv } from 'src/common/utils/load.env';

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
  // migrationsRun: true,
  schema: process.env.DATABASE_SCHEMA,
  // dropSchema: process.env.TYPEORM_DROPSCHEMA === 'true',
  // synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  // logging: process.env.TYPEORM_LOGGING === 'true',
});

// import { NestFactory } from '@nestjs/core';
// import { DataSource } from 'typeorm';
// import { dataSourceOptions } from './data-source-options';
// import { getDataSourceOptions } from './data-source-options';
// import { ConfigService } from '@nestjs/config';
// import { AppModule } from 'src/app.module';

//export const AppDataSource = new DataSource(dataSourceOptions);

// // https://github.com/typeorm/typeorm/issues/8914
// export default NestFactory.create(AppModule)
//   .then((app) => app.get(DataSource))
//   .then((dataSource) => Promise.all([dataSource, dataSource.destroy()]))
//   .then(([dataSource]) => {
//     // console.log(dataSource);
//     return dataSource;
//   });

// async function load() {
//   await getDataSourceOptions(new ConfigService());
// }

// export default await load();

// import { DataSource, InstanceChecker } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config();

// function patchAsyncDataSourceSetup() {
//   const oldIsDataSource = InstanceChecker.isDataSource;
//   InstanceChecker.isDataSource = function (obj: unknown): obj is DataSource {
//     if (obj instanceof Promise) {
//       return true;
//     }
//     return oldIsDataSource(obj);
//   };
// }

// patchAsyncDataSourceSetup();

// function patchAsyncDataSourceSetup() {
//   // const oldIsDataSource = InstanceChecker.isDataSource;
//   InstanceChecker.isDataSource = function (obj: unknown): obj is DataSource {
//     if (obj instanceof Promise) {
//       return true;
//     }
//     return (
//       typeof obj === 'object' &&
//       obj !== null &&
//       (obj as { '@instanceof': symbol })['@instanceof'] === Symbol.for('DataSource')
//     );
//   };
// }

// patchAsyncDataSourceSetup();

// export default getDataSourceOptions(new ConfigService());
