import { Entity, Column } from 'typeorm';
import { artist as PrismaArtist } from '@prisma/client';
import { UUID } from 'crypto';
import { BaseLibClass } from '../lib.base.model';
import { ArtistDto } from './artist.dto';
import { toAppEntity } from 'src/prisma/prisma.converter';

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

  static createFromPrisma(prismaArtist: PrismaArtist): Artist {
    return toAppEntity(prismaArtist, this.prototype);
  }

  updateFromDto(updateDto: ArtistDto): void {
    Object.assign(this, {
      name: updateDto.name ?? this.name,
      grammy: updateDto.grammy !== undefined ? updateDto.grammy : this.grammy,
    });
  }
}
