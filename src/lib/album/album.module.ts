import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { LibServiceModule } from '../lib.service.module';

@Module({
  imports: [LibServiceModule],
  controllers: [AlbumController],
})
export class AlbumModule {}
