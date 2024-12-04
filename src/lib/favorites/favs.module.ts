import { Module } from '@nestjs/common';
import { LibServiceModule } from '../lib.service.module';
import { FavoritesController } from './favs.controller';
import { Artist } from '../artist/artist.model';
import { Track } from '../track/track.model';
import { Album } from '../album/album.model';

@Module({
  imports: [LibServiceModule.register({ typeormRepo: [Artist, Track, Album] })],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
