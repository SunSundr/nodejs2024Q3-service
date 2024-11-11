import {
  // Controller,
  Get,
  Post,
  Put,
  Delete,
  // Param,
  // Body,
  Request,
  // ParseUUIDPipe,
  NotFoundException,
  // ForbiddenException,
  BadRequestException,
  // UsePipes,
  HttpCode,
  // ValidationPipe,
  HttpStatus,
  // HttpException,
  // UseGuards,
  // NestInterceptor,
  //UseInterceptors,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

// import { Request } from 'express';
// import { Request } from '@nestjs/common';

import { LibService } from './lib.service';
// import { CreateUserDto, UpdateUserDto } from './dto/dto';
// import { UserByIdInterceptor } from '../common/interceptors/user-by-id.interceptor';
// import { UUID } from 'crypto';
// import { User } from '../users/models/user.model';

// import { createEntityInterceptor } from './entity.interceptor';
import { isUUID, validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
import { TrackDto } from '../common/dto/track.dto';
import { ArtistDto } from '../common/dto/artist.dto';
import { AlbumDto } from '../common/dto/album.dto';
import { UUID } from 'crypto';

// type InterceptorFactory = (dtoClass: {
//   new (): SupportedDtos;
// }) => NestInterceptor;
// readonly entityInterceptor: NestInterceptor;

type SupportedModels = typeof Track | typeof Artist | typeof Album;
type SupportedDtos = TrackDto | ArtistDto | AlbumDto;
type SupportedType = Artist | Track | Album;

// export interface RequestWithEntity extends ExpressRequest {
//   entity: SupportedType;
// }

// function createInterceptorInstance(
//   controller: LibBaseController,
// ): NestInterceptor {
//   console.log('controller', this);
//   const interceptorClass = controller.getInterceptor();

//   // if (typeof interceptorClass === 'function') {
//   //   return new interceptorClass(); //  создаем экземпляр, если это класс
//   // }

//   return interceptorClass; // возвращаем как есть, если уже экземпляр
// }

interface ValidateResult {
  entity: SupportedType | null;
  dto?: SupportedDtos;
  errors?: ValidationError[];
}

export abstract class LibBaseController {
  protected readonly owner: SupportedModels;
  protected readonly dtoClass: { new (): SupportedDtos };

  constructor(protected readonly libService: LibService) {}

  protected async requestValidate(req: ExpressRequest): Promise<ValidateResult> {
    const { id } = req.params as { id: UUID };

    if (req.method !== 'POST' && !isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    let dto: SupportedDtos | undefined;

    if (req.method !== 'DELETE' && req.method !== 'GET') {
      dto = plainToClass(this.dtoClass, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Validation failed',
          errors: errors.map((error: ValidationError) => {
            const children = error.children || {};
            return {
              property: error.property,
              constraints: error.constraints,
              ...children,
            };
          }),
        });
      }
    }

    let entity: SupportedType | null;

    if (req.method !== 'POST') {
      entity = await this.libService.getById(this.owner, id);

      if (!entity) {
        throw new NotFoundException(`Entity with id ${id} not found`);
      }
    } else {
      entity = null;
    }

    return { entity, dto };
  }

  @Get()
  async getAll(): Promise<SupportedType[]> {
    return await this.libService.getAll(this.owner);
  }

  @Get(':id')
  async getById(@Request() req: ExpressRequest): Promise<SupportedType> {
    return (await this.requestValidate(req)).entity;
  }

  @Post()
  async create(@Request() req: ExpressRequest): Promise<SupportedType> {
    const { dto } = await this.requestValidate(req);
    return await this.libService.create(this.owner, dto);
  }

  @Put(':id')
  async update(@Request() req: ExpressRequest): Promise<SupportedType> {
    const { entity, dto } = await this.requestValidate(req);
    if (!dto) throw new BadRequestException('Body is invalid');
    return await this.libService.update(this.owner, entity, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: ExpressRequest): Promise<void> {
    const { entity } = await this.requestValidate(req);
    return this.libService.delete(this.owner, entity);
  }
}
