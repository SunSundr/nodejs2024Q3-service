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

export interface ILibRepository {
  get<T = MapsType>(id: UUID, type: MapsName): Promise<T | undefined>;
  getAll<T = MapsType>(type: MapsName): Promise<T[] | undefined>;
  save<T = MapsType>(obj: MapsType, type: MapsName): Promise<T>;
  delete(id: UUID, type: MapsName): Promise<void>;
}

export interface Favorites {
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
}
