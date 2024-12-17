import { UUID } from 'crypto';
import { LibBaseDto } from '../lib.base.dto';
export declare class TrackDto extends LibBaseDto {
    duration: number;
    artistId: UUID | null;
    albumId: UUID | null;
}
