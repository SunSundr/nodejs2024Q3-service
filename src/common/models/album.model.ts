import { UUID } from 'crypto';
import { BaseLibClass } from './_base.model';
import { AlbumDto } from '../dto/album.dto';

export class Album extends BaseLibClass {
  private constructor(
    readonly userId: UUID | null,
    public name: string,
    public year: number | null = null,
    public artistId: string | null = null,
  ) {
    super(userId);
  }

  static createFromDto(createDto: AlbumDto, userId: UUID | null = null): Album {
    return new Album(
      userId,
      createDto.name,
      createDto.year,
      createDto.artistId,
    );
  }

  updateFromDto(updateDto: AlbumDto): void {
    Object.assign(this, {
      name: updateDto.name ?? this.name,
      year: updateDto.year !== undefined ? updateDto.year : this.year,
      artistId:
        updateDto.artistId !== undefined ? updateDto.artistId : this.artistId,
    });
  }
}
