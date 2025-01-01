import { Injectable, Provider } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../lib/track/track.model';
import { Artist } from '../lib/artist/artist.model';
import { Album } from '../lib/album/album.model';
import { ILibRepository, LibNames, LibTypes, FavoritesJSON } from './lib.repo.interface';
import { Favorites } from './lib.favs.model';
import { LIB_REPOSITORY_TOKEN } from './tokens';

@Injectable()
export class LibInMemoryRepository implements ILibRepository {
  private static instance: LibInMemoryRepository;
  static provider(): Provider {
    return {
      provide: LIB_REPOSITORY_TOKEN,
      useFactory: () => this.instance || (this.instance = new LibInMemoryRepository()),
    };
  }

  private readonly artists = new Map<UUID, Artist>();
  private readonly tracks = new Map<UUID, Track>();
  private readonly albums = new Map<UUID, Album>();
  private readonly favorites = new Favorites(this.artists, this.tracks, this.albums);

  private async getMap(type: LibNames): Promise<Map<UUID, LibTypes> | undefined> {
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

  async saveEntyty(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const map = await this.getMap(type);
    if (map) map.set(obj.id, obj);
    return obj as LibTypes;
  }

  async updateByID(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const map = await this.getMap(type);
    if (map) map.set(obj.id, obj);
    return obj as LibTypes;
  }

  async get(id: UUID, type: LibNames, userID: UUID | null): Promise<LibTypes | undefined> {
    const map = await this.getMap(type);
    const entity = map.get(id);
    return entity && entity.userId === userID ? entity : undefined;
  }

  async getAll(type: LibNames, userID: UUID | null): Promise<LibTypes[] | undefined> {
    const map = await this.getMap(type);
    return map
      ? (Array.from(map.values()).filter((v) => v.userId === userID) as LibTypes[])
      : undefined;
  }

  async deleteByID(id: UUID, type: LibNames): Promise<void> {
    const map = await this.getMap(type);
    if (map) {
      map.delete(id);
      if (type === 'album') {
        this.tracks.forEach((track) => {
          if (track.albumId === id) track.albumId = null;
        });
      } else if (type === 'artist') {
        this.tracks.forEach((track) => {
          if (track.artistId === id) {
            track.artistId = null;
          }
        });
        this.albums.forEach((album) => {
          if (album.artistId === id) {
            album.artistId = null;
          }
        });
      }
    }
    return;
  }

  private async getFavsData(
    id: UUID,
    type: LibNames,
    userId: UUID | null,
  ): Promise<{ map?: Map<UUID, LibTypes>; entity?: LibTypes }> {
    const map = await this.getMap(type);
    if (!map) return {};
    const entity = map.get(id);
    if (!entity || entity.userId !== userId) return {};
    return { map, entity };
  }

  async getFavs(userId: UUID | null): Promise<FavoritesJSON> {
    return await this.favorites.getAll(userId);
  }

  async setFavs(id: UUID, type: LibNames, status: boolean, userId: UUID | null): Promise<void> {
    const { entity, map } = await this.getFavsData(id, type, userId);
    if (!entity || !map) return;
    if (status) {
      await this.favorites.add(entity, map);
    } else {
      await this.favorites.remove(entity, map);
    }
  }
}
