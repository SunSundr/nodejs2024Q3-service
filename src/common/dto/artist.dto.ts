import {
  // IsUUID,
  IsNotEmpty,
  IsString,
  IsBoolean,
  // IsNumber,
  // Min,
} from 'class-validator';
// import { UUID } from 'crypto';

export class ArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy?: boolean;
}
