import { Module } from '@nestjs/common';
import { LibService } from '../lib.service';
import { InMemoryLibRepository } from '../../db/lib.repo';
import { ArtistController } from './artist.controller';

@Module({
  controllers: [ArtistController],
  providers: [
    LibService,
    { provide: 'ILibRepository', useClass: InMemoryLibRepository },
  ],
  // exports: ['ILibRepository'],
})
export class ArtistModule {}
