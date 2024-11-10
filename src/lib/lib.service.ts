import {
  Injectable,
  // NotFoundException,
  // ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
// import { TrackDto } from '../common/dto/track.dto';
// import { LibDtoType, MapsType, MapsName } from '../db/lib.repo.interface';
import { MapsName } from '../db/lib.repo.interface';
import { ILibRepository } from '../db/lib.repo.interface';

import { TrackDto } from '../common/dto/track.dto';
import { ArtistDto } from '../common/dto/artist.dto';
import { AlbumDto } from '../common/dto/album.dto';

type SupportedModels = typeof Track | typeof Artist | typeof Album;
type SupportedDtos = TrackDto | ArtistDto | AlbumDto;
type SupportedType = Artist | Track | Album;

@Injectable()
export class LibService {
  constructor(
    @Inject('ILibRepository') private readonly libRepository: ILibRepository,
  ) {}

  static callByOwner(
    owner: SupportedModels,
    func: (..._: unknown[]) => SupportedType | void,
    dto: SupportedDtos,
    ...args: unknown[]
  ): void | SupportedType {
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

  static typeNameByOwner(owner: SupportedModels): MapsName {
    return owner.name.toLowerCase() as MapsName;
  }

  async create(
    owner: SupportedModels,
    createDto: SupportedDtos,
  ): Promise<SupportedType | null> {
    // const newEntity = owner.createFromDto(createDto as any);
    const newEntity = LibService.callByOwner(
      owner,
      owner.createFromDto,
      createDto,
    );
    if (!newEntity) return null;
    return await this.libRepository.save<SupportedType>(
      newEntity,
      LibService.typeNameByOwner(owner),
    );
  }

  async update(
    owner: SupportedModels,
    obj: SupportedType,
    updateDto: SupportedDtos,
  ): Promise<SupportedType> {
    //obj.updateFromDto(updateDto as any);
    LibService.callByOwner(owner, obj.updateFromDto, updateDto);
    return await this.libRepository.save<SupportedType>(
      obj,
      LibService.typeNameByOwner(owner),
    );
  }

  async getAll(owner: SupportedModels): Promise<SupportedType[]> {
    return await this.libRepository.getAll(LibService.typeNameByOwner(owner));
  }

  async getById(
    owner: SupportedModels,
    id: UUID,
  ): Promise<SupportedType | null> {
    const entity = await this.libRepository.get<SupportedType>(
      id,
      LibService.typeNameByOwner(owner),
    );
    return entity ? entity : null;
  }

  async delete(owner: SupportedModels, obj: SupportedType): Promise<void> {
    await this.libRepository.delete(obj.id, LibService.typeNameByOwner(owner));
  }
}
