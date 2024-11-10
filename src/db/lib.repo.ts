import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
import {
  ILibRepository,
  MapsName,
  MapsType,
  Favorites,
} from './lib.repo.interface';
// import { UserIdParamDto } from '../dto/dto';

@Injectable()
export class InMemoryLibRepository implements ILibRepository {
  private readonly artists = new Map<UUID, Artist>();
  private readonly tracks = new Map<UUID, Track>();
  private readonly albums = new Map<UUID, Album>();
  private readonly favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  private async getMap(
    type: MapsName,
  ): Promise<Map<UUID, MapsType> | undefined> {
    switch (type) {
      case 'artist':
        return this.artists;

      case 'track':
        return this.tracks;

      case 'album':
        return this.albums;

      default:
        return undefined;
    }
  }

  async save(obj: MapsType, type: MapsName): Promise<MapsType> {
    const map = await this.getMap(type);
    if (map) map.set(obj.id, obj);
    return obj as MapsType;
  }

  async get(id: UUID, type: MapsName): Promise<MapsType | undefined> {
    const map = await this.getMap(type);
    return map.get(id);
  }

  async getAll(type: MapsName): Promise<MapsType[] | undefined> {
    const map = await this.getMap(type);
    return map ? (Array.from(map.values()) as MapsType[]) : undefined;
  }

  async delete(id: UUID, type: MapsName): Promise<void> {
    const map = await this.getMap(type);
    if (map) map.delete(id);
    return;
  }
}

//------------------------------------------------------------------------------
/* private async getMap2<T>(obj: T): Promise<Map<UUID, unknown> | undefined> {
    switch (true) {
      case obj instanceof Artist:
        return this.artists;

      case obj instanceof Track:
        return this.tracks;

      case obj instanceof Album:
        return this.albums;

      default:
        return undefined;
    }
  } */

/*   async save<T>(obj: T): Promise<T> {
    const map = await this.getMap2<T>(obj);
    if (map) map.set(obj['id'], obj);
    return obj;
  } */
