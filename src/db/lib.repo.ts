import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
import { ILibRepository, MapsName, MapsType, FavoritesJSON } from './lib.repo.interface';
import { Favorites } from './lib.favs.model';
// import { UserIdParamDto } from '../dto/dto';

@Injectable()
export class InMemoryLibRepository implements ILibRepository {
  private readonly artists = new Map<UUID, Artist>();
  private readonly tracks = new Map<UUID, Track>();
  private readonly albums = new Map<UUID, Album>();
  private readonly favorites = new Favorites(this.artists, this.tracks, this.albums);

  private async getMap(type: MapsName): Promise<Map<UUID, MapsType> | undefined> {
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
    type: MapsName,
  ): Promise<{ map?: Map<UUID, MapsType>; entity?: MapsType }> {
    const map = await this.getMap(type);
    if (!map) return {};
    const entity = map.get(id);
    if (!entity) return {};
    return { map, entity };
  }

  async getFavs(userId: UUID | null): Promise<FavoritesJSON> {
    return await this.favorites.getAll(userId);
  }

  async addFavs(id: UUID, type: MapsName): Promise<void> {
    const { entity, map } = await this.getFavsData(id, type);
    if (!entity || !map) return;
    await this.favorites.add(entity, map);
  }

  async removeFavs(id: UUID, type: MapsName): Promise<void> {
    const { entity, map } = await this.getFavsData(id, type);
    if (!entity || !map) return;
    await this.favorites.remove(entity, map);
  }
}
