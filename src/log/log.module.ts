import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { appConfigServiceProvider } from 'src/app.config.service';

@Module({
  providers: [LogService, appConfigServiceProvider],
  exports: [LogService],
})
export class LogModule {}
