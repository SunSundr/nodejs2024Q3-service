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
  private readonly repositoryMap = {
    artist: this.prisma.artist,
    track: this.prisma.track,
    album: this.prisma.album,
  };

  private readonly entityMap = {
    artist: (entity: LibPrismaTypes) => Artist.createFromPrisma(entity as PrismaArtist),
    track: (entity: LibPrismaTypes) => Track.createFromPrisma(entity as PrismaTrack),
    album: (entity: LibPrismaTypes) => Album.createFromPrisma(entity as PrismaAlbum),
  };

  constructor(private readonly prisma: PrismaService) {}

  private getRepository(
    type: LibNames,
  ): Prisma.artistDelegate | Prisma.trackDelegate | Prisma.albumDelegate | undefined {
    return this.repositoryMap[type];
  }

  private getEntity(
    type: LibNames,
    entity: PrismaTrack | PrismaArtist | PrismaAlbum,
  ): LibTypes | undefined {
    const createEntityFunc = this.entityMap[type];
    return createEntityFunc ? createEntityFunc(entity) : undefined;
  }

  private validateArgs(args: unknown[]): void {
    if (!Array.isArray(args)) {
      throw new Error('Arguments must be an array');
    }
  }

  private async callRepository<T>(
    type: LibNames,
    func: keyof Prisma.artistDelegate | keyof Prisma.trackDelegate | keyof Prisma.albumDelegate,
    args: unknown[],
  ): Promise<T> {
    this.validateArgs(args);
    const repo = this.getRepository(type);
    if (!repo) throw new Error(`Repository for type "${type}" not found`);
    if (!(func in repo))
      throw new Error(`Method ${func.toString()} not found in repository for type ${type}`);

    const method = repo[func] as (...args: unknown[]) => Promise<T>;
    return await method(...args);
  }

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
    // const entities = await Promise.all(
    //   Object.entries(this.repositoryMap).map(async ([type, repo]) => {
    //     const results = await (repo as { findMany: (a: unknown) => Promise<unknown[]> }).findMany({
    //       where: { userId, favorite: true },
    //     });
    //     return results.map(this.entityMap[type]);
    //   }),
    // );

    // return {
    //   artists: entities[0] as Artist[],
    //   tracks: entities[1] as Track[],
    //   albums: entities[2] as Album[],
    // };

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
