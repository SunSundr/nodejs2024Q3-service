import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { isUUID, validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UUID } from 'crypto';
import { Track } from './track/track.model';
import { Artist } from './artist/artist.model';
import { Album } from './album/album.model';
import { TrackDto } from './track/track.dto';
import { ArtistDto } from './artist/artist.dto';
import { AlbumDto } from './album/album.dto';
import { ReqMethod } from 'src/common/utils/req-method.enum';
import { LibNames } from '../db/lib.repo.interface';
import { ILibRepository, FavoritesJSON } from '../db/lib.repo.interface';
import { LibModels, LibDtos, LibTypes } from '../db/lib.repo.interface';
import { LIB_REPOSITORY_TOKEN } from 'src/db/tokens';

export interface ValidateResult {
  entity: LibTypes | null;
  dto?: LibDtos;
  errors?: ValidationError[];
  userId: UUID | null;
}

@Injectable()
export class LibService {
  constructor(@Inject(LIB_REPOSITORY_TOKEN) private readonly libRepository: ILibRepository) {}

  static callByOwner(
    owner: LibModels,
    func: (..._: unknown[]) => LibTypes | void,
    dto: LibDtos,
    ...args: unknown[]
  ): void | LibTypes {
    switch (owner) {
      case Track:
        return func(dto as TrackDto, ...args);
      case Artist:
        return func(dto as ArtistDto, ...args);
      case Album:
        return func(dto as AlbumDto, ...args);
      default:
        return;
    }
  }

  static typeNameByOwner(owner: LibModels): LibNames {
    return owner.name.toLowerCase() as LibNames;
  }

  static getUserId(req: ExpressRequest): UUID | null {
    return req['userId'] ? req['userId'] : null;
  }

  async requestValidate(
    req: ExpressRequest,
    owner: LibModels,
    dtoClass: { new (): LibDtos },
  ): Promise<ValidateResult> {
    const { id } = req.params as { id: UUID };
    const userId = LibService.getUserId(req);

    if (req.method !== ReqMethod.POST && !isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    let dto: LibDtos | undefined;

    if (req.method !== ReqMethod.DELETE && req.method !== ReqMethod.GET) {
      dto = plainToClass(dtoClass, req.body);
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

    let entity: LibTypes | null;

    if (req.method !== ReqMethod.POST) {
      entity = await this.getById(owner, id, userId);

      if (!entity) {
        throw new NotFoundException(`Entity with id ${id} not found`);
      }
    } else {
      entity = null;
    }

    return { entity, dto, userId };
  }

  async create(owner: LibModels, createDto: LibDtos, userID: UUID): Promise<LibTypes | null> {
    // const newEntity = owner.createFromDto(createDto as any);  // short call
    const newEntity = LibService.callByOwner(owner, owner.createFromDto, createDto, userID);
    if (!newEntity) return null;
    return await this.libRepository.saveEntyty(newEntity, LibService.typeNameByOwner(owner));
  }

  async update(owner: LibModels, obj: LibTypes, updateDto: LibDtos | undefined): Promise<LibTypes> {
    // obj.updateFromDto(updateDto as any); // short call
    if (!updateDto) throw new BadRequestException('Body is invalid');
    LibService.callByOwner(owner, obj.updateFromDto.bind(obj), updateDto);
    return await this.libRepository.updateByID(obj, LibService.typeNameByOwner(owner));
  }

  async getAll(owner: LibModels, userID: UUID | null): Promise<LibTypes[]> {
    return await this.libRepository.getAll(LibService.typeNameByOwner(owner), userID);
  }

  async getById(owner: LibModels, id: UUID, userID: UUID | null): Promise<LibTypes | null> {
    const entity = await this.libRepository.get(id, LibService.typeNameByOwner(owner), userID);
    return entity || null;
  }

  async delete(owner: LibModels, obj: LibTypes): Promise<void> {
    await this.libRepository.deleteByID(obj.id, LibService.typeNameByOwner(owner));
  }

  async setFavorite(
    owner: LibModels,
    id: UUID,
    status: boolean,
    userId: UUID | null,
  ): Promise<LibTypes | null> {
    const entity = await this.getById(owner, id, userId);
    if (!entity) throw new UnprocessableEntityException(`${owner.name} not found`);
    const type = owner.name.toLowerCase() as LibNames;
    entity.favorite = status;
    await this.libRepository.setFavs(id, type, status, userId);
    return entity;
  }

  async getAllFavs(userId: UUID | null): Promise<FavoritesJSON> {
    return await this.libRepository.getFavs(userId);
  }
}
