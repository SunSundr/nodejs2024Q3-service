import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from '../users/user.model';
import { IUserRepository } from './users.repo.interface';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<UUID, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async get(id: UUID): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAll(): Promise<User[] | undefined> {
    return Array.from(this.users.values());
  }

  async delete(id: UUID): Promise<void> {
    this.users.delete(id);
    return;
  }
}
