// import { BaseLibClass } from 'src/common/models/_base.model';
import { UUID } from 'crypto';
import { Album } from 'src/common/models/album.model';
import { Artist } from 'src/common/models/artist.model';
import { Track } from 'src/common/models/track.model';
import { MapsType, FavoritesJSON } from './lib.repo.interface';

export class Favorites {
  constructor(
    private readonly artists: Map<UUID, Artist>,
    private readonly tracks: Map<UUID, Track>,
    private readonly albums: Map<UUID, Album>,
  ) {}

  private async filter(map: Map<UUID, MapsType>, _userId: UUID | null): Promise<MapsType[]> {
    // entity.favorite && entity.id === _userId
    return Array.from(map.values()).filter((entity) => entity.favorite);
  }

  async getAll(_userId: UUID | null): Promise<FavoritesJSON> {
    return {
      artists: (await this.filter(this.artists, _userId)) as Artist[],
      tracks: (await this.filter(this.tracks, _userId)) as Track[],
      albums: (await this.filter(this.albums, _userId)) as Album[],
    };
  }

  async add(entity: MapsType, map: Map<UUID, MapsType>): Promise<void> {
    entity.favorite = true;
    map.set(entity.id, entity);
  }

  async remove(entity: MapsType, map: Map<UUID, MapsType>): Promise<void> {
    entity.favorite = false;
    map.set(entity.id, entity);
  }
}
