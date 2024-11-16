import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from '../users/user.model';
import { IUserRepository } from './users.repo.interface';
import { UpdateUserDto } from 'src/users/user.dto';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<UUID, User> = new Map();

  async saveEntyty(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async updateEntity(user: User, _: UpdateUserDto): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async getById(id: UUID): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserWithPasswordById(id: UUID): Promise<Partial<User>> {
    return this.users.get(id);
  }

  async getAll(): Promise<User[] | undefined> {
    return Array.from(this.users.values());
  }

  async deleteByID(id: UUID): Promise<void> {
    this.users.delete(id);
    return;
  }
}
