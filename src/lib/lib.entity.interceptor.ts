// NOT USED NOW
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { ILibRepository } from '../db/lib.repo.interface';
import { LibService } from './lib.service';
import { isUUID, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
import { TrackDto } from '../common/dto/track.dto';
import { ArtistDto } from '../common/dto/artist.dto';
import { AlbumDto } from '../common/dto/album.dto';
// import { MapsName } from '../db/lib.repo.interface';
type SupportedDtos = TrackDto | ArtistDto | AlbumDto;
type SupportedModels = typeof Track | typeof Artist | typeof Album;

type InterceptorFactory = (dtoClass: {
  new (): SupportedDtos;
}) => NestInterceptor;

export function createEntityInterceptor(
  owner: SupportedModels,
  libService: LibService,
): InterceptorFactory {
  @Injectable()
  class EntityInterceptor implements NestInterceptor {
    constructor(private readonly dtoClass: { new (): SupportedDtos }) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const request = context.switchToHttp().getRequest();
      const { id } = request.params;

      if (!isUUID(id)) {
        throw new BadRequestException('Invalid UUID');
      }

      let updateDto: SupportedDtos | undefined;

      if (request.method !== 'DELETE' && request.method !== 'GET') {
        updateDto = plainToClass(this.dtoClass, request.body);
        const errors = await validate(updateDto);

        if (errors.length > 0) {
          throw new BadRequestException('Invalid request body');
        }
      }

      const entity = await libService.getById(owner, id);

      if (!entity) {
        throw new NotFoundException(`Entity with id ${id} not found`);
      }

      request.entity = entity;

      return next.handle().pipe(map((data) => data));
    }
  }

  return (dtoClass) => new EntityInterceptor(dtoClass);
}

// const trackInterceptor = createEntityInterceptor(libRepository, 'track')(TrackDto);
