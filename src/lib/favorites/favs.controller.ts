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
  Request,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Request as ExpressRequest } from 'express';
import { LibService } from '../lib.service';
import { Track } from 'src/lib/track/track.model';
import { Artist } from 'src/lib/artist/artist.model';
import { Album } from 'src/lib/album/album.model';
import { LibNames, LibTypes, LibModels } from 'src/db/lib.repo.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(readonly libService: LibService) {}

  private async setFavs(
    owner: LibModels,
    id: UUID,
    add: boolean,
    userId: UUID | null,
  ): Promise<LibTypes | null> {
    const entity = await this.libService.getById(owner, id, userId);
    if (!entity) throw new UnprocessableEntityException(`${owner.name} not found`);
    await this.libService.applyFavs(id, owner.name.toLowerCase() as LibNames, add, userId);
    return entity;
  }

  protected getUserId(req: ExpressRequest): UUID | null {
    return req['userId'] ? req['userId'] : null;
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all favorite items' })
  async findAll(@Request() req: ExpressRequest) {
    return await this.libService.getAllFavs(this.getUserId(req));
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Track added to favorites' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for trackId' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Track not found' })
  @UsePipes(new ValidationPipe())
  async addTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID,
    @Request() req: ExpressRequest,
  ) {
    return await this.setFavs(Track, id, true, this.getUserId(req));
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Remove track from favorites' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Track removed from favorites' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for trackId' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Track not found in favorites' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID,
    @Request() req: ExpressRequest,
  ) {
    return await this.setFavs(Track, id, false, this.getUserId(req));
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Album added to favorites' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for albumId' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Album not found' })
  @UsePipes(new ValidationPipe())
  async addAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID,
    @Request() req: ExpressRequest,
  ) {
    return await this.setFavs(Album, id, true, this.getUserId(req));
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Remove album from favorites' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Album removed from favorites' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for albumId' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Album not found in favorites' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID,
    @Request() req: ExpressRequest,
  ) {
    return await this.setFavs(Album, id, false, this.getUserId(req));
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Artist added to favorites' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for artistId' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Artist not found' })
  @UsePipes(new ValidationPipe())
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID,
    @Request() req: ExpressRequest,
  ) {
    return await this.setFavs(Artist, id, true, this.getUserId(req));
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Remove artist from favorites' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Artist removed from favorites' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID format for artistId' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Artist not found in favorites' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID,
    @Request() req: ExpressRequest,
  ) {
    return await this.setFavs(Artist, id, false, this.getUserId(req));
  }
}
