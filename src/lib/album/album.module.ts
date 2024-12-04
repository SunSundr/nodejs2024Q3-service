import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { LibServiceModule } from '../lib.service.module';
import { Album } from './album.model';

@Module({
  imports: [LibServiceModule.register({ typeormRepo: [Album] })],
  controllers: [AlbumController],
})
export class AlbumModule {}
