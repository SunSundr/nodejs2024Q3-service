import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { LibServiceModule } from '../lib.service.module';

@Module({
  imports: [LibServiceModule],
  controllers: [ArtistController],
})
export class ArtistModule {}
