import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../lib/track/track.model';
import { Artist } from '../lib/artist/artist.model';
import { Album } from '../lib/album/album.model';
import { ILibRepository, LibNames, LibTypes, FavoritesJSON } from './lib.repo.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { track as PrismaTrack } from '@prisma/client';
import { artist as PrismaArtist } from '@prisma/client';
import { album as PrismaAlbum } from '@prisma/client';

type LibPrismaTypes = PrismaTrack | PrismaArtist | PrismaAlbum;

@Injectable()
export class LibPrismaRepository implements ILibRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getRepository(
    type: LibNames,
  ): Prisma.artistDelegate | Prisma.trackDelegate | Prisma.albumDelegate | undefined {
    switch (type) {
      case 'artist':
        return this.prisma.artist;

      case 'track':
        return this.prisma.track;

      case 'album':
        return this.prisma.album;

      default:
        return undefined;
    }
  }

  private getEntity(
    type: LibNames,
    entity: PrismaTrack | PrismaArtist | PrismaAlbum,
  ): LibTypes | undefined {
    switch (type) {
      case 'artist':
        return Artist.createFromPrisma(entity as PrismaArtist);

      case 'track':
        return Track.createFromPrisma(entity as PrismaTrack);

      case 'album':
        return Album.createFromPrisma(entity as PrismaAlbum);

      default:
        return undefined;
    }
  }

  private async callRepository<T>(
    type: LibNames,
    func: keyof Prisma.artistDelegate | keyof Prisma.trackDelegate | keyof Prisma.albumDelegate,
    args: unknown[],
  ): Promise<T> {
    const repo = this.getRepository(type);
    if (!repo) throw new Error(`Repository for type "${type}" not found`);
    if (!(func in repo))
      throw new Error(`Method ${func.toString()} not found in repository for type ${type}`);

    const method = repo[func] as (...args: unknown[]) => Promise<T>;
    return await method(...args);
  }

  //---------------------------------

  async saveEntyty(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const result = await this.callRepository<LibPrismaTypes>(type, 'create', [
      { data: obj.toPrismaEntity() },
    ]);
    return this.getEntity(type, result);
  }

  async updateByID(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const result = await this.callRepository<LibPrismaTypes>(type, 'update', [
      { where: { id: obj.id }, data: obj.toPrismaEntity() },
    ]);
    return this.getEntity(type, result);
  }

  async get(id: UUID, type: LibNames, userId: UUID | null): Promise<LibTypes | undefined> {
    const result = await this.callRepository<LibPrismaTypes>(type, 'findUnique', [
      { where: { id, userId } },
    ]);
    return result ? this.getEntity(type, result) : undefined;
  }

  async getAll(type: LibNames, userId: UUID | null): Promise<LibTypes[]> {
    const result = await this.callRepository<LibPrismaTypes[]>(type, 'findMany', [
      { where: { userId } },
    ]);
    return result.map((pEntity) => this.getEntity(type, pEntity));
  }

  async deleteByID(id: UUID, type: LibNames): Promise<void> {
    await this.callRepository(type, 'delete', [{ where: { id } }]);
  }

  async getFavs(userId: UUID | null): Promise<FavoritesJSON> {
    const [artists, tracks, albums] = await Promise.all([
      this.prisma.artist.findMany({ where: { userId, favorite: true } }),
      this.prisma.track.findMany({ where: { userId, favorite: true } }),
      this.prisma.album.findMany({ where: { userId, favorite: true } }),
    ]);
    return {
      artists: artists.map((pArtst) => Artist.createFromPrisma(pArtst)),
      tracks: tracks.map((pTrack) => Track.createFromPrisma(pTrack)),
      albums: albums.map((pAlbum) => Album.createFromPrisma(pAlbum)),
    };
  }

  async setFavs(id: UUID, type: LibNames, status: boolean, userId: UUID | null): Promise<void> {
    const entity = await this.get(id, type, userId);
    if (!entity) return;
    await this.callRepository(type, 'update', [{ where: { id }, data: { favorite: status } }]);
  }
}
