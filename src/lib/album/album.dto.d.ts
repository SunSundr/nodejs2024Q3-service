import { UUID } from 'crypto';
import { LibBaseDto } from '../lib.base.dto';
export declare class AlbumDto extends LibBaseDto {
    year: number;
    artistId: UUID | null;
}
