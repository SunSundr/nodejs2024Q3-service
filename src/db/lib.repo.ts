import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../lib/track/track.model';
import { Artist } from '../lib/artist/artist.model';
import { Album } from '../lib/album/album.model';
import { ILibRepository, LibNames, LibTypes, FavoritesJSON } from './lib.repo.interface';
import { Favorites } from './lib.favs.model';

@Injectable()
export class InMemoryLibRepository implements ILibRepository {
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

  async save(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const map = await this.getMap(type);
    if (map) map.set(obj.id, obj);
    return obj as LibTypes;
  }

  async get(id: UUID, type: LibNames): Promise<LibTypes | undefined> {
    const map = await this.getMap(type);
    return map.get(id);
  }

  async getAll(type: LibNames): Promise<LibTypes[] | undefined> {
    const map = await this.getMap(type);
    return map ? (Array.from(map.values()) as LibTypes[]) : undefined;
  }

  async delete(id: UUID, type: LibNames): Promise<void> {
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
  ): Promise<{ map?: Map<UUID, LibTypes>; entity?: LibTypes }> {
    const map = await this.getMap(type);
    if (!map) return {};
    const entity = map.get(id);
    if (!entity) return {};
    return { map, entity };
  }

  async getFavs(userId: UUID | null): Promise<FavoritesJSON> {
    return await this.favorites.getAll(userId);
  }

  async addFavs(id: UUID, type: LibNames): Promise<void> {
    const { entity, map } = await this.getFavsData(id, type);
    if (!entity || !map) return;
    await this.favorites.add(entity, map);
  }

  async removeFavs(id: UUID, type: LibNames): Promise<void> {
    const { entity, map } = await this.getFavsData(id, type);
    if (!entity || !map) return;
    await this.favorites.remove(entity, map);
  }
}
