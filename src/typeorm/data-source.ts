// import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
// import { dataSourceOptions } from './data-source-options';
import { AppModule } from 'src/app.module';

// export const AppDataSource = new DataSource(dataSourceOptions);

// https://github.com/typeorm/typeorm/issues/8914
export default NestFactory.create(AppModule)
  .then((app) => app.get(DataSource))
  .then((dataSource) => Promise.all([dataSource, dataSource.destroy()]))
  .then(([dataSource]) => dataSource);
