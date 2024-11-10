import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { LibServiceModule } from '../lib.service.module';

@Module({
  imports: [LibServiceModule],
  controllers: [TrackController],
})
export class TrackModule {}
