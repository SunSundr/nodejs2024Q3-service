import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { LibServiceModule } from '../lib.service.module';
import { Track } from './track.model';

@Module({
  imports: [LibServiceModule.register({ typeormRepo: [Track] })],
  controllers: [TrackController],
})
export class TrackModule {}
