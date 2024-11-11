import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FavoritesDto {
  @IsUUID()
  id: UUID;
}