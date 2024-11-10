import {
  // Controller,
  Get,
  Post,
  Put,
  Delete,
  // Param,
  Body,
  Request,
  // ParseUUIDPipe,
  // NotFoundException,
  // ForbiddenException,
  // BadRequestException,
  UsePipes,
  HttpCode,
  ValidationPipe,
  // UseGuards,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
// import { Request } from 'express';
import { LibService } from './lib.service';
// import { CreateUserDto, UpdateUserDto } from './dto/dto';
// import { UserByIdInterceptor } from '../common/interceptors/user-by-id.interceptor';
// import { UUID } from 'crypto';
// import { User } from '../users/models/user.model';

// import { createEntityInterceptor } from './entity.interceptor';

import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
import { TrackDto } from '../common/dto/track.dto';
import { ArtistDto } from '../common/dto/artist.dto';
import { AlbumDto } from '../common/dto/album.dto';

// type InterceptorFactory = (dtoClass: {
//   new (): SupportedDtos;
// }) => NestInterceptor;
// readonly entityInterceptor: NestInterceptor;

type SupportedModels = typeof Track | typeof Artist | typeof Album;
type SupportedDtos = TrackDto | ArtistDto | AlbumDto;
type SupportedType = Artist | Track | Album;

export interface RequestWithEntity extends Request {
  entity: SupportedType;
}

export abstract class LibBaseController {
  protected readonly owner: SupportedModels;
  protected abstract getInterceptor(): NestInterceptor;

  constructor(protected readonly libService: LibService) {}

  @Get()
  async getAll() {
    return await this.libService.getAll(this.owner);
  }

  @Get(':id')
  @UseInterceptors((controller) => controller.getInterceptor())
  async getUserById(@Request() req: RequestWithEntity) {
    return req.entity;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: SupportedDtos) {
    const user = await this.libService.create(this.owner, dto);
    return user;
  }

  @Put(':id')
  @UseInterceptors((controller) => controller.getInterceptor())
  updateUser(@Body() dto: SupportedDtos, @Request() req: RequestWithEntity) {
    return this.libService.update(this.owner, req.entity, dto);
  }

  @Delete(':id')
  @UseInterceptors((controller) => controller.getInterceptor())
  @HttpCode(204)
  deleteUser(@Request() req: RequestWithEntity) {
    return this.libService.delete(this.owner, req.entity);
  }
}

/* 
const entityInterceptor = createEntityInterceptor(
  owner,
  libService,
)(TrackDto); // TrackDto | ArtistDto | AlbumDto 
*/
