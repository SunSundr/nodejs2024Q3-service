import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseLibClass } from '../lib.base.model';
import { TrackDto } from './track.dto';
import { Artist } from '../artist/artist.model';
import { Album } from '../album/album.model';
import { serialize } from 'src/common/utils/serialize';
import { UUID } from 'crypto';

@Entity()
export class Track extends BaseLibClass {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public artistId: UUID | null;

  @Column({ nullable: true })
  public albumId: UUID | null;

  @Column({ default: 0 })
  public duration: number;

  // relations
  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  public artist: Artist | null;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId' })
  public album: Album | null;

  private constructor(
    userId: UUID | null,
    name: string,
    artistId: UUID | null = null,
    albumId: UUID | null = null,
    duration: number = 0,
  ) {
    super(userId);
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
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
      artistId: updateDto.artistId ?? this.artistId,
      albumId: updateDto.albumId ?? this.albumId,
      duration: updateDto.duration ?? this.duration,
    });
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['user', 'userId', 'favorite', 'artist', 'album']);
  }
}
