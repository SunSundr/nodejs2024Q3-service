import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Track } from '../lib/track/track.model';
import { Artist } from '../lib/artist/artist.model';
import { Album } from '../lib/album/album.model';
import { ILibRepository, LibNames, LibTypes, FavoritesJSON } from './lib.repo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LibTypeOrmRepository implements ILibRepository {
  constructor(
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Track) private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
  ) {}

  private getRepository(type: LibNames): Repository<Artist | Track | Album> | undefined {
    switch (type) {
      case 'artist':
        return this.artistRepository;

      case 'track':
        return this.trackRepository;

      case 'album':
        return this.albumRepository;

      default:
        return undefined;
    }
  }

  async saveEntyty(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const repository = this.getRepository(type);
    if (repository) {
      return await repository.save(obj);
    }
    throw new Error(`Repository for type "${type}" not found`);
  }

  async updateByID(obj: LibTypes, type: LibNames): Promise<LibTypes> {
    const repository = this.getRepository(type);
    if (repository) {
      const { id, ...data } = obj;
      await repository.update(id, data);
      return await repository.findOne({ where: { id } });
    }
    throw new Error(`Repository for type "${type}" not found`);
  }

  async get(id: UUID, type: LibNames, userId: UUID | null): Promise<LibTypes | undefined> {
    const repository = this.getRepository(type);
    if (repository) {
      return await repository.findOne({ where: { id, userId } });
    }
    throw new Error(`Repository for type "${type}" not found`);
  }

  async getAll(type: LibNames, userId: UUID | null): Promise<LibTypes[]> {
    const repository = this.getRepository(type);
    if (repository) {
      return await repository.find({ where: { userId } });
    }
    throw new Error(`Repository for type "${type}" not found`);
  }

  async deleteByID(id: UUID, type: LibNames): Promise<void> {
    const repository = this.getRepository(type);
    if (!repository) {
      throw new Error(`Repository for type "${type}" not found`);
    }

    await repository.delete(id);
  }

  private async getFavsData(
    id: UUID,
    type: LibNames,
    userId: UUID,
  ): Promise<{ repository?: Repository<Artist | Track | Album>; entity?: LibTypes }> {
    const repository = this.getRepository(type);
    if (!repository) return {};
    const entity = await repository.findOne({ where: { id, userId } });
    if (!entity) return {};
    return { repository, entity };
  }

  async getFavs(userId: UUID | null): Promise<FavoritesJSON> {
    return {
      artists: await this.artistRepository.find({ where: { userId, favorite: true } }),
      tracks: await this.trackRepository.find({ where: { userId, favorite: true } }),
      albums: await this.albumRepository.find({ where: { userId, favorite: true } }),
    };
  }

  async setFavs(id: UUID, type: LibNames, status: boolean, userId: UUID | null): Promise<void> {
    const { entity, repository } = await this.getFavsData(id, type, userId);
    if (!entity || !repository) return;
    await repository.update(id, { favorite: status });
  }
}
