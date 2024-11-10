import {
  // IsUUID,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { UUID } from 'crypto';

export class TrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  duration: number;

  artistId: UUID | null;
  albumId: UUID | null;
}
