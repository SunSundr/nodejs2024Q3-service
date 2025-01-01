import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/utils/public.decorator';

@ApiTags('API Information')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getInfo(): Record<string, string[]> | null {
    return this.appService.getRoutesInfo();
  }
}
