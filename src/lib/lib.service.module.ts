import { Module, Provider } from '@nestjs/common';
import { LibService } from './lib.service';
import { LibInMemoryRepository } from '../db/lib.repo';
import { LibTypeOrmRepository } from 'src/db/lib.repo.typeORM';
import { OrmTypes } from 'src/common/utils/validate.env';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LibPrismaRepository } from 'src/db/lib.repo.prisma';

function getLibProviders(ormType: OrmTypes): Provider[] {
  const providers: Provider[] = [LibService];
  switch (ormType) {
    case OrmTypes.MEMORY:
      providers.push(LibInMemoryRepository.provider());
      break;

    case OrmTypes.TYPEORM:
      providers.push(LibTypeOrmRepository.provider());
      break;

    case OrmTypes.PRISMA:
      providers.push(LibPrismaRepository.provider());
      break;

    default:
      throw new Error(`Unsupported ORM type: ${ormType}`);
  }

  return providers;
}

@Module({
  imports: process.env.ORM_TYPE === OrmTypes.PRISMA ? [PrismaModule] : [],
  providers: getLibProviders(process.env.ORM_TYPE as OrmTypes),
  exports: [LibService],
})
export class LibServiceModule {}
