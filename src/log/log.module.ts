import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { AppConfigService } from 'src/app.config.service';

@Module({
  providers: [LogService, AppConfigService.provider()],
  exports: [LogService],
})
export class LogModule {}
