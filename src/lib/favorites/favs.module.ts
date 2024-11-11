import { Module } from '@nestjs/common';
import { LibServiceModule } from '../lib.service.module';
import { FavoritesController } from './favs.controller';

@Module({
  imports: [LibServiceModule],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
