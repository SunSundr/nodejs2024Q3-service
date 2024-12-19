import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { LibService } from './lib.service';
import { LibInMemoryRepository } from '../db/lib.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.model';
// import { Artist } from './artist/artist.model';
// import { Track } from './track/track.model';
// import { Album } from './album/album.model';
import { LibTypeOrmRepository } from 'src/db/lib.repo.typeORM';
import { LibModels } from 'src/db/lib.repo.interface';
import { OrmTypes } from 'src/common/utils/validate.env';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LibPrismaRepository } from 'src/db/lib.repo.prisma';

// @Module({
//   imports: [TypeOrmModule.forFeature([User, Artist, Track, Album])],
//   providers: [LibService, { provide: 'ILibRepository', useClass: LibTypeOrmRepository }],
//   // providers: [LibService, { provide: 'ILibRepository', useClass: LibInMemoryRepository }],
//   exports: [LibService],
// })
// export class LibServiceModule {}

interface LibServiceOptions {
  typeormRepo?: LibModels[];
}

@Module({})
export class LibServiceModule {
  private static libRepository: LibInMemoryRepository;

  static register(options: LibServiceOptions): DynamicModule {
    const imports: ModuleMetadata['imports'] = [];
    const providers: ModuleMetadata['providers'] = [LibService];

    const ormType = process.env.ORM_TYPE;
    if (ormType === OrmTypes.MEMORY) {
      // providers.push({ provide: 'ILibRepository', useClass: LibInMemoryRepository });
      providers.push({
        provide: 'ILibRepository',
        useFactory: () => this.libRepository || (this.libRepository = new LibInMemoryRepository()),
      });
    } else if (ormType === OrmTypes.TYPEORM) {
      const typeormRepo = options.typeormRepo ?? [];
      imports.push(TypeOrmModule.forFeature([User, ...typeormRepo]));
      providers.push({ provide: 'ILibRepository', useClass: LibTypeOrmRepository });
    } else if (ormType === OrmTypes.PRISMA) {
      imports.push(PrismaModule);
      providers.push({ provide: 'ILibRepository', useClass: LibPrismaRepository });
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
