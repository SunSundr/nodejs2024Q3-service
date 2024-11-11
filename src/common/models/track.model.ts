import { UUID } from 'crypto';
import { BaseLibClass } from './_base.model';
import { TrackDto } from '../dto/track.dto';

export class Track extends BaseLibClass {
  private constructor(
    readonly userId: UUID | null,
    public name: string,
    public artistId: string | null = null,
    public albumId: string | null = null,
    public duration: number = 0,
  ) {
    super(userId);
  }

  static createFromDto(createDto: TrackDto, userId: UUID | null = null): Track {
    return new Track(
      userId,
      createDto.name,
      createDto.artistId,
      createDto.albumId,
      createDto.duration,
    );
  }

  updateFromDto(updateDto: TrackDto): void {
    Object.assign(this, {
      name: updateDto.name ?? this.name,
      artistId: updateDto.artistId !== undefined ? updateDto.artistId : this.artistId,
      albumId: updateDto.albumId !== undefined ? updateDto.albumId : this.albumId,
      duration: updateDto.duration !== undefined ? updateDto.duration : this.duration,
    });
  }
}
