import { UUID } from 'crypto';
import { Track } from '../lib/track/track.model';
import { Artist } from '../lib/artist/artist.model';
import { Album } from '../lib/album/album.model';
import { TrackDto } from '../lib/track/track.dto';
import { ArtistDto } from '../lib/artist/artist.dto';
import { AlbumDto } from '../lib/album/album.dto';

type LibMap = {
  artist: { model: typeof Artist; dto: ArtistDto; type: Artist };
  track: { model: typeof Track; dto: TrackDto; type: Track };
  album: { model: typeof Album; dto: AlbumDto; type: Album };
};

export type LibNames = keyof LibMap;
export type LibModels<T extends LibNames = LibNames> = LibMap[T]['model'];
export type LibDtos<T extends LibNames = LibNames> = LibMap[T]['dto'];
export type LibTypes<T extends LibNames = LibNames> = LibMap[T]['type'];

export interface ILibRepository {
  get(id: UUID, type: LibNames): Promise<LibTypes | undefined>;
  getAll(type: LibNames): Promise<LibTypes[] | undefined>;
  save(obj: LibTypes, type: LibNames): Promise<LibTypes>;
  delete(id: UUID, type: LibNames): Promise<void>;
  getFavs(userId: UUID | null): Promise<FavoritesJSON>;
  addFavs(id: UUID, type: LibNames): Promise<void>;
  removeFavs(id: UUID, type: LibNames): Promise<void>;
}

export interface FavoritesJSON {
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
}
