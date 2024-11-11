import { UUID } from 'crypto';
import { Track } from '../lib/track/track.model';
import { Artist } from '../lib/artist/artist.model';
import { Album } from '../lib/album/album.model';
import { TrackDto } from '../lib/track/track.dto';
import { ArtistDto } from '../lib/artist/artist.dto';
import { AlbumDto } from '../lib/album/album.dto';

export type LibNames = 'artist' | 'track' | 'album';
export type LibModels = typeof Track | typeof Artist | typeof Album;
export type LibDtos = TrackDto | ArtistDto | AlbumDto;
export type LibTypes = Artist | Track | Album;

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
