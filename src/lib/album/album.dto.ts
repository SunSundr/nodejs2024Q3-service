import { IsNumber, Min } from 'class-validator';
import { UUID } from 'crypto';
import { LibBaseDto } from '../lib.base.dto';

export class AlbumDto extends LibBaseDto {
  @IsNumber()
  @Min(1000)
  year: number;

  artistId: UUID | null;
}
