import { Entity, Column } from 'typeorm';
import { BaseLibClass } from '../lib.base.model';
import { ArtistDto } from './artist.dto';
import { UUID } from 'crypto';

@Entity()
export class Artist extends BaseLibClass {
  @Column()
  public name: string;

  @Column({ default: false })
  public grammy: boolean;

  private constructor(userId: UUID | null, name: string, grammy: boolean = false) {
    super(userId);
    this.name = name;
    this.grammy = grammy;
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
