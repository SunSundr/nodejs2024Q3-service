import { Module, DynamicModule, ModuleMetadata } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserInMemoryRepository } from '../db/users.repo.memory';
import { UserTypeOrmRepository } from 'src/db/users.repo.typeorm';
import { OrmTypes } from 'src/common/utils/validate.env';
import { UserPrismaRepository } from 'src/db/users.repo.prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({})
export class UsersModule {
  private static forFeatureData: DynamicModule | null = null;

  static forRoot(): DynamicModule {
    return {
      ...this.forFeature(),
      controllers: [UsersController],
    };
  }

  static forFeature(): DynamicModule {
    if (this.forFeatureData) return this.forFeatureData;

    const imports: ModuleMetadata['imports'] = [];
    const providers: ModuleMetadata['providers'] = [UsersService];
    const exports: ModuleMetadata['exports'] = [UsersService];

    const ormType = process.env.ORM_TYPE;
    if (ormType === OrmTypes.MEMORY) {
      providers.push(UserInMemoryRepository.provider());
    } else if (ormType === OrmTypes.TYPEORM) {
      providers.push(UserTypeOrmRepository.provider());
    } else if (ormType === OrmTypes.PRISMA) {
      imports.push(PrismaModule);
      providers.push(UserPrismaRepository.provider());
    } else {
      throw new Error(`Unsupported ORM_TYPE: ${ormType}`);
    }

    this.forFeatureData = {
      module: UsersModule,
      imports,
      providers,
      exports,
    };
    return this.forFeatureData;
  }
}
