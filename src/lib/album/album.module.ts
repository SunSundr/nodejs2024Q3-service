import { Module } from '@nestjs/common';
import { LibService } from '../lib.service';
import { InMemoryLibRepository } from '../../db/lib.repo';
import { AlbumController } from './album.controller';

@Module({
  controllers: [AlbumController],
  providers: [
    LibService,
    { provide: 'ILibRepository', useClass: InMemoryLibRepository },
  ],
  // exports: ['ILibRepository'],
})
export class AlbumModule {}
