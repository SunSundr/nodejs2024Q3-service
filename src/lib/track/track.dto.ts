import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { UUID } from 'crypto';
import { IsUUIDOrNull } from '../../common/utils/IsUUIDOrNull.decorator';
import { LibBaseDto } from '../lib.base.dto';

export class TrackDto extends LibBaseDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  duration: number;

  @IsUUIDOrNull()
  artistId: UUID | null;

  @IsUUIDOrNull()
  albumId: UUID | null;
}
