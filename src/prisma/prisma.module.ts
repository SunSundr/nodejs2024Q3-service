import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LogModule } from 'src/log/log.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, LogModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
