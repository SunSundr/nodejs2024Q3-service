import { UUID } from 'crypto';
import { Track } from '../common/models/track.model';
import { Artist } from '../common/models/artist.model';
import { Album } from '../common/models/album.model';
import { TrackDto } from '../common/dto/track.dto';
import { ArtistDto } from '../common/dto/artist.dto';
import { AlbumDto } from '../common/dto/album.dto';

export type MapsName = 'artist' | 'track' | 'album';
export type MapsType = Artist | Track | Album;
export type LibDtoType = TrackDto | ArtistDto | AlbumDto;

export interface FavoritesJSON {
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
}

export interface ILibRepository {
  get(id: UUID, type: MapsName): Promise<MapsType | undefined>;
  getAll(type: MapsName): Promise<MapsType[] | undefined>;
  save(obj: MapsType, type: MapsName): Promise<MapsType>;
  delete(id: UUID, type: MapsName): Promise<void>;
  getFavs(userId: UUID | null): Promise<FavoritesJSON>;
  addFavs(id: UUID, type: MapsName): Promise<void>;
  removeFavs(id: UUID, type: MapsName): Promise<void>;
}
