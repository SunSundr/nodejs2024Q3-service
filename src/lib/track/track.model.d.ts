import { BaseLibClass } from '../lib.base.model';
import { TrackDto } from './track.dto';
import { Artist } from '../artist/artist.model';
import { Album } from '../album/album.model';
import { UUID } from 'crypto';
export declare class Track extends BaseLibClass {
    name: string;
    artistId: UUID | null;
    albumId: UUID | null;
    duration: number;
    artist: Artist | null;
    album: Album | null;
    private constructor();
    static createFromDto(createDto: TrackDto, userId?: UUID | null): Track;
    updateFromDto(updateDto: TrackDto): void;
    toJSON(): {
        [key: string]: unknown;
    };
}
