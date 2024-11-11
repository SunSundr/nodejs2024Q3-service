import { UUID } from 'crypto';
import { BaseLibClass } from '../lib.base.model';
import { ArtistDto } from './artist.dto';

export class Artist extends BaseLibClass {
  private constructor(
    readonly userId: UUID | null,
    public name: string,
    public grammy: boolean = false,
  ) {
    super(userId);
  }

  static createFromDto(createDto: ArtistDto, userId: UUID | null = null): Artist {
    return new Artist(userId, createDto.name, createDto.grammy);
  }

  updateFromDto(updateDto: ArtistDto): void {
    Object.assign(this, {
      name: updateDto.name ?? this.name,
      grammy: updateDto.grammy !== undefined ? updateDto.grammy : this.grammy,
    });
  }
}
