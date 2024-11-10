import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { InMemoryLibRepository } from '../../db/lib.repo';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    { provide: 'ILibRepository', useClass: InMemoryLibRepository },
  ],
  // exports: ['IUserRepository'],
})
export class TrackModule {}
