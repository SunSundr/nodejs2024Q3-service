import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistModule } from './lib/artist/artist.module';
import { TrackModule } from './lib/track/track.module';
import { AlbumModule } from './lib/album/album.module';
import { FavoritesModule } from './lib/favorites/favs.module';
// import { LibModule } from './lib/lib.module';

@Module({
  imports: [UsersModule, ArtistModule, TrackModule, AlbumModule, FavoritesModule],
  // imports: [UsersModule, LibModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
