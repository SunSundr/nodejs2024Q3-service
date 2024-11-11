import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UUID } from 'crypto';

import { LibService } from '../lib.service';
import { Track } from 'src/common/models/track.model';
import { Artist } from 'src/common/models/artist.model';
import { Album } from 'src/common/models/album.model';
import { MapsName, MapsType } from 'src/db/lib.repo.interface';

type SupportedModels = typeof Track | typeof Artist | typeof Album;

@Controller('favs')
export class FavoritesController {
  constructor(readonly libService: LibService) {}

  private async setFavs(owner: SupportedModels, id: UUID, add: boolean): Promise<MapsType | null> {
    const entity = await this.libService.getById(owner, id);
    if (!entity) throw new UnprocessableEntityException(`${owner.name} not found`);
    await this.libService.applyFavs(id, owner.name.toLowerCase() as MapsName, add);
    return entity;
  }

  @Get()
  async findAll() {
    return await this.libService.getAllFavs(null);
  }

  @Post('track/:id')
  @UsePipes(new ValidationPipe())
  async addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
    return await this.setFavs(Track, id, true);
  }

  @Post('album/:id')
  @UsePipes(new ValidationPipe())
  async addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
    return await this.setFavs(Album, id, true);
  }

  @Post('artist/:id')
  @UsePipes(new ValidationPipe())
  async addArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
    return await this.setFavs(Artist, id, true);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
    return await this.setFavs(Track, id, false);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
    return await this.setFavs(Album, id, false);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID) {
    return await this.setFavs(Artist, id, false);
  }
}
