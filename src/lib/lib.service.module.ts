import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { LibService } from './lib.service';
import { InMemoryLibRepository } from '../db/lib.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.model';
// import { Artist } from './artist/artist.model';
// import { Track } from './track/track.model';
// import { Album } from './album/album.model';
import { LibTypeOrmRepository } from 'src/db/lib.repo.typeORM';
import { LibModels } from 'src/db/lib.repo.interface';
import { OrmTypes } from 'src/common/utils/validate.env';

// @Module({
//   imports: [TypeOrmModule.forFeature([User, Artist, Track, Album])],
//   providers: [LibService, { provide: 'ILibRepository', useClass: LibTypeOrmRepository }],
//   // providers: [LibService, { provide: 'ILibRepository', useClass: InMemoryLibRepository }],
//   exports: [LibService],
// })
// export class LibServiceModule {}

interface LibServiceOptions {
  typeormRepo?: LibModels[];
}

@Module({})
export class LibServiceModule {
  static register(options: LibServiceOptions): DynamicModule {
    const imports: ModuleMetadata['imports'] = [];
    const providers: ModuleMetadata['providers'] = [LibService];

    const ormType = process.env.ORM_TYPE;
    if (ormType === OrmTypes.MEMORY) {
      providers.push({ provide: 'ILibRepository', useClass: InMemoryLibRepository });
    } else if (ormType === OrmTypes.TYPEORM) {
      const typeormRepo = options.typeormRepo ?? [];
      imports.push(TypeOrmModule.forFeature([User, ...typeormRepo]));
      providers.push({ provide: 'ILibRepository', useClass: LibTypeOrmRepository });
    } else {
      throw new Error(`Unsupported ORM_TYPE: ${ormType}`);
    }

    return {
      module: LibServiceModule,
      imports,
      providers,
      exports: [LibService],
    };
  }
}
