import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LibModule } from './lib/lib.module';

@Module({
  imports: [UsersModule, LibModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
