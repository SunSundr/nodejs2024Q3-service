import {
  // IsUUID,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { UUID } from 'crypto';
import { IsUUIDOrNull } from '../utils/IsUUIDOrNull.decorator';

export class TrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  duration: number;

  @IsUUIDOrNull()
  artistId: UUID | null;

  @IsUUIDOrNull()
  albumId: UUID | null;
}
