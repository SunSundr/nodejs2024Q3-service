import { Entity, Column } from 'typeorm';
import { BaseLibClass } from '../lib.base.model';
import { AlbumDto } from './album.dto';

@Entity()
export class Album extends BaseLibClass {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public year: number | null;

  @Column({ nullable: true })
  public artistId: string | null;

  private constructor(
    userId: string | null,
    name: string,
    year: number | null = null,
    artistId: string | null = null,
  ) {
    super(userId);
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }

  static createFromDto(createDto: AlbumDto, userId: string | null = null): Album {
    return new Album(userId, createDto.name, createDto.year, createDto.artistId);
  }

  updateFromDto(updateDto: AlbumDto): void {
    Object.assign(this, {
      name: updateDto.name ?? this.name,
      year: updateDto.year ?? this.year,
      artistId: updateDto.artistId ?? this.artistId,
    });
  }
}
