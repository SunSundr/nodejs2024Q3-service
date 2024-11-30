import { Module } from '@nestjs/common';
import { LibService } from './lib.service';
//import { InMemoryLibRepository } from '../db/lib.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.model';
import { Artist } from './artist/artist.model';
import { Track } from './track/track.model';
import { Album } from './album/album.model';
import { LibTypeOrmRepository } from 'src/db/lib.repo.typeORM';
// import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artist, Track, Album])],
  providers: [LibService, { provide: 'ILibRepository', useClass: LibTypeOrmRepository }],
  // providers: [LibService, { provide: 'ILibRepository', useClass: InMemoryLibRepository }],
  exports: [LibService],
})
export class LibServiceModule {}
