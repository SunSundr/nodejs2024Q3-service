import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InMemoryUserRepository } from './repo/users.repo';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'IUserRepository', useClass: InMemoryUserRepository },
  ],
  // exports: ['IUserRepository'],
})
export class UsersModule {}
