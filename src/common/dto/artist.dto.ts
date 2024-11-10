import {
  // IsUUID,
  IsNotEmpty,
  IsString,
  // IsNumber,
  // Min,
} from 'class-validator';
// import { UUID } from 'crypto';

export class ArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  grammy?: boolean;
}
