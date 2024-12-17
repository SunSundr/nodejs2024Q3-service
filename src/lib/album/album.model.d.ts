import { BaseLibClass } from '../lib.base.model';
import { AlbumDto } from './album.dto';
import { Artist } from '../artist/artist.model';
import { UUID } from 'crypto';
export declare class Album extends BaseLibClass {
    name: string;
    year: number | null;
    artistId: UUID | null;
    artist: Artist | null;
    private constructor();
    static createFromDto(createDto: AlbumDto, userId?: UUID | null): Album;
    updateFromDto(updateDto: AlbumDto): void;
    toJSON(): {
        [key: string]: unknown;
    };
}
