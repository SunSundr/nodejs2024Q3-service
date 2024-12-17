import { BaseLibClass } from '../lib.base.model';
import { ArtistDto } from './artist.dto';
import { UUID } from 'crypto';
export declare class Artist extends BaseLibClass {
    name: string;
    grammy: boolean;
    private constructor();
    static createFromDto(createDto: ArtistDto, userId?: UUID | null): Artist;
    updateFromDto(updateDto: ArtistDto): void;
}
