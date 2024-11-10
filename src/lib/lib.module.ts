// NOT USED NOW
import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [AlbumModule, ArtistModule, TrackModule],
})
export class LibModule {}
