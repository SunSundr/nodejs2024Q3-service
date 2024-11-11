import { Injectable, Inject } from '@nestjs/common';
import { UUID } from 'crypto';
import { IUserRepository } from '../db/users.repo.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async createUser(createDto: CreateUserDto): Promise<User> {
    const newUser = User.createFromDto(createDto);
    return await this.userRepository.save(newUser);
  }

  async updateUser(user: User, updateDto: UpdateUserDto): Promise<User> {
    user.updateFromDto(updateDto);
    return await this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async getById(id: UUID): Promise<User | null> {
    const user = await this.userRepository.get(id);
    return user ? user : null;
  }

  async delete(user: User): Promise<boolean> {
    await this.userRepository.delete(user.id);
    return true;
  }
}
