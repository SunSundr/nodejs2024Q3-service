import { Module, DynamicModule, ModuleMetadata } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { User } from '../users/user.model';
import { UserInMemoryRepository } from '../db/users.repo';
import { UserTypeOrmRepository } from 'src/db/users.repo.typeORM';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
import { OrmTypes } from 'src/common/utils/validate.env';
import { UserPrismaRepository } from 'src/db/users.repo.prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   controllers: [UsersController],
//   // providers: [UsersService, { provide: 'IUserRepository', useClass: UserInMemoryRepository }],
//   providers: [UsersService, { provide: 'IUserRepository', useClass: UserTypeOrmRepository }],
//   exports: [UsersService],
// })
// export class UsersModule {}

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
      // providers.push({ provide: 'IUserRepository', useClass: UserInMemoryRepository });
      providers.push(UserInMemoryRepository.provider());

      // let iUserRepo: UserInMemoryRepository;
      // providers.push({
      //   provide: 'IUserRepository',
      //   useFactory: () => iUserRepo || (iUserRepo = new UserInMemoryRepository()),
      // });
    } else if (ormType === OrmTypes.TYPEORM) {
      // imports.push(TypeOrmModule.forFeature([User]));
      // providers.push({ provide: 'IUserRepository', useClass: UserTypeOrmRepository });

      providers.push(UserTypeOrmRepository.provider());

      // let iUserRepo: UserTypeOrmRepository;
      // providers.push({
      //   provide: 'IUserRepository',
      //   inject: [DataSource],
      //   useFactory: (dataSource: DataSource) =>
      //     iUserRepo || (iUserRepo = new UserTypeOrmRepository(dataSource.getRepository(User))),
      // });
    } else if (ormType === OrmTypes.PRISMA) {
      imports.push(PrismaModule);
      providers.push(UserPrismaRepository.provider());
      // providers.push({ provide: 'IUserRepository', useClass: UserPrismaRepository });
      // let iUserRepo: UserPrismaRepository;
      // providers.push({
      //   provide: 'IUserRepository',
      //   inject: [PrismaService],
      //   useFactory: (prisma: PrismaService) =>
      //     iUserRepo || (iUserRepo = new UserPrismaRepository(prisma)),
      // });
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
