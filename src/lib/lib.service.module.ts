import { Module } from '@nestjs/common';
import { LibService } from './lib.service';
import { InMemoryLibRepository } from '../db/lib.repo';

@Module({
  providers: [
    LibService,
    { provide: 'ILibRepository', useClass: InMemoryLibRepository },
  ],
  exports: [LibService],
})
export class LibServiceModule {}
