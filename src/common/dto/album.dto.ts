import {
  // IsUUID,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { UUID } from 'crypto';

export class AlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1000)
  year: number;

  artistId: UUID | null;
}
