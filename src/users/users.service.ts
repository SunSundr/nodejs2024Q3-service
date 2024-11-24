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
    return await this.userRepository.saveEntyty(newUser);
  }

  async updateUser(user: User, updateDto: UpdateUserDto): Promise<User> {
    user.updateFromDto(updateDto);
    return await this.userRepository.updateEntity(user, updateDto);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async getById(id: UUID): Promise<User | null> {
    const user = await this.userRepository.getById(id);
    return user ? user : null;
  }

  async delete(user: User): Promise<boolean> {
    await this.userRepository.deleteByID(user.id);
    return true;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return await this.userRepository.getByLogin(login);
  }
}
