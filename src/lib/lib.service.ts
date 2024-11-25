import { Injectable, Inject } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from './track/track.model';
import { Artist } from './artist/artist.model';
import { Album } from './album/album.model';
import { TrackDto } from './track/track.dto';
import { ArtistDto } from './artist/artist.dto';
import { AlbumDto } from './album/album.dto';
import { LibNames } from '../db/lib.repo.interface';
import { ILibRepository, FavoritesJSON } from '../db/lib.repo.interface';
import { LibModels, LibDtos, LibTypes } from '../db/lib.repo.interface';

@Injectable()
export class LibService {
  constructor(@Inject('ILibRepository') private readonly libRepository: ILibRepository) {}

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

  async create(owner: LibModels, createDto: LibDtos, userID: UUID): Promise<LibTypes | null> {
    // const newEntity = owner.createFromDto(createDto as any);
    console.log('userID:', userID);
    const newEntity = LibService.callByOwner(owner, owner.createFromDto, createDto, userID);
    if (!newEntity) return null;
    return await this.libRepository.saveEntyty(newEntity, LibService.typeNameByOwner(owner));
  }

  async update(owner: LibModels, obj: LibTypes, updateDto: LibDtos): Promise<LibTypes> {
    // obj.updateFromDto(updateDto as any);
    LibService.callByOwner(owner, obj.updateFromDto.bind(obj), updateDto);
    return await this.libRepository.updateByID(obj, LibService.typeNameByOwner(owner));
  }

  async getAll(owner: LibModels): Promise<LibTypes[]> {
    return await this.libRepository.getAll(LibService.typeNameByOwner(owner));
  }

  async getById(owner: LibModels, id: UUID): Promise<LibTypes | null> {
    const entity = await this.libRepository.get(id, LibService.typeNameByOwner(owner));
    return entity || null;
  }

  async delete(owner: LibModels, obj: LibTypes): Promise<void> {
    await this.libRepository.deleteByID(obj.id, LibService.typeNameByOwner(owner));
  }

  async getAllFavs(userId: UUID | null): Promise<FavoritesJSON> {
    return await this.libRepository.getFavs(userId);
  }

  async applyFavs(id: UUID, type: LibNames, add: boolean): Promise<void> {
    if (add) {
      await this.libRepository.addFavs(id, type);
    } else {
      await this.libRepository.removeFavs(id, type);
    }
  }
}
