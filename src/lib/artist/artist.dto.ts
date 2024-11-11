import { IsBoolean } from 'class-validator';
import { LibBaseDto } from '../lib.base.dto';

export class ArtistDto extends LibBaseDto {
  @IsBoolean()
  grammy?: boolean;
}
