import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InMemoryUserRepository } from '../db/users.repo';

@Module({
  controllers: [UsersController],
  providers: [UsersService, { provide: 'IUserRepository', useClass: InMemoryUserRepository }],
  // exports: [UsersService],
})
export class UsersModule {}
