import { Entity, Column } from 'typeorm';
import { BaseLibClass } from '../lib.base.model';
import { TrackDto } from './track.dto';

@Entity()
export class Track extends BaseLibClass {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public artistId: string | null;

  @Column({ nullable: true })
  public albumId: string | null;

  @Column({ default: 0 })
  public duration: number;

  private constructor(
    userId: string | null,
    name: string,
    artistId: string | null = null,
    albumId: string | null = null,
    duration: number = 0,
  ) {
    super(userId);
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
  }

  static createFromDto(createDto: TrackDto, userId: string | null = null): Track {
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
      artistId: updateDto.artistId ?? this.artistId,
      albumId: updateDto.albumId ?? this.albumId,
      duration: updateDto.duration ?? this.duration,
    });
  }
}
