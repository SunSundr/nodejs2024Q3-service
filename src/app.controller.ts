import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Main (help)')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): Record<string, string[]> | null {
    return this.appService.getRoutesInfo();
  }
}
