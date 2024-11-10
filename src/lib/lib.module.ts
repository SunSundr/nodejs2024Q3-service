import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
// import { TrackController } from './track.controller';
// import { LibService } from './lib.service';
// import { InMemoryLibRepository } from '../db/lib.repo';

@Module({
  imports: [AlbumModule, ArtistModule, TrackModule],
  // controllers: [TrackController],
  // providers: [
  //   LibService,
  //   { provide: 'ILibRepository', useClass: InMemoryLibRepository },
  // ],
  // exports: ['ILibRepository'],
})
export class LibModule {}
