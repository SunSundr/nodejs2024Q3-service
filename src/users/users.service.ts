import {
  Injectable,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { IUserRepository } from '../db/users.repo.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async createUser(createDto: CreateUserDto): Promise<User> {
    const newUser = User.createFromDto(createDto);
    try {
      return await this.userRepository.saveEntyty(newUser);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Invalid user data';
      console.error('Error:', msg);
      throw new UnprocessableEntityException(msg);
    }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const uniqStatus = await user.checkPassword(updateUserDto.newPassword);
    if (uniqStatus === null) {
      throw new InternalServerErrorException('Failed to verify password');
    } else if (uniqStatus) {
      throw new ForbiddenException('New password must be different from the current password');
    }
    user.updateFromDto(updateUserDto);
    return await this.userRepository.updateEntity(user, updateUserDto);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async getById(id: UUID): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundException('User with not found');
    return user;
  }

  async delete(user: User): Promise<boolean> {
    await this.userRepository.deleteByID(user.id);
    return true;
  }

  async findByLogin(login: string): Promise<User | null> {
    return await this.userRepository.getByLogin(login);
  }
}
