import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from '../users/user.model';
import { IUserRepository } from './users.repo.interface';
import { UpdateUserDto } from 'src/users/user.dto';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private readonly users: Map<UUID, User> = new Map();

  async saveEntyty(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async updateEntity(user: User, _: UpdateUserDto): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async getById(id: UUID): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  async getUserWithPasswordById(id: UUID): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  async getAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteByID(id: UUID): Promise<void> {
    this.users.delete(id);
  }

  async getByLogin(login: string): Promise<User | null> {
    const users = await this.getAll();
    for (const user of users) {
      if (user.login === login) return user;
    }
    return null;
  }
}
