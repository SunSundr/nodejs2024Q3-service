import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { LibService } from '../lib.service';
import { InMemoryLibRepository } from '../../db/lib.repo';

@Module({
  controllers: [TrackController],
  providers: [
    LibService,
    { provide: 'ILibRepository', useClass: InMemoryLibRepository },
  ],
  // exports: ['ILibRepository'],
})
export class TrackModule {}
