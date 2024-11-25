import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseLibClass } from '../lib.base.model';
import { AlbumDto } from './album.dto';
import { Artist } from '../artist/artist.model';
import { serialize } from 'src/common/utils/serialize';
import { UUID } from 'crypto';

@Entity()
export class Album extends BaseLibClass {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public year: number | null;

  @Column({ nullable: true })
  public artistId: UUID | null;

  // relations
  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  public artist: null;

  private constructor(
    userId: UUID | null,
    name: string,
    year: number | null = null,
    artistId: UUID | null = null,
  ) {
    super(userId);
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }

  static createFromDto(createDto: AlbumDto, userId: UUID | null = null): Album {
    return new Album(userId, createDto.name, createDto.year, createDto.artistId);
  }

  updateFromDto(updateDto: AlbumDto): void {
    Object.assign(this, {
      name: updateDto.name ?? this.name,
      year: updateDto.year ?? this.year,
      artistId: updateDto.artistId ?? this.artistId,
    });
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['userId', 'favorite', 'artist']);
  }
}
