import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.model';
// import { InMemoryUserRepository } from '../db/users.repo';
import { UserTypeOrmRepository } from 'src/db/users.repo.typeORM';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // providers: [UsersService, { provide: 'IUserRepository', useClass: InMemoryUserRepository }],
  providers: [UsersService, { provide: 'IUserRepository', useClass: UserTypeOrmRepository }],
  exports: [UsersService],
})
export class UsersModule {}
