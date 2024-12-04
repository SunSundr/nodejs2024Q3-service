import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { LibServiceModule } from '../lib.service.module';
import { Artist } from './artist.model';

@Module({
  imports: [LibServiceModule.register({ typeormRepo: [Artist] })],
  controllers: [ArtistController],
})
export class ArtistModule {}
