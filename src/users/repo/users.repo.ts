// src/users/repo/users.repo.ts
import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { IUserRepository } from './users.repo.interface';
// import { UserIdParamDto } from '../dto/dto';
import { UUID } from 'crypto';

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
