import {
  Injectable,
  // NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { User } from './models/user.model';
import { IUserRepository } from './repo/users.repo.interface';
import { CreateUserDto, UpdateUserDto } from './dto/dto';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

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
    return await this.userRepository.get(id);
  }

  async delete(user: User): Promise<boolean> {
    await this.userRepository.delete(user.id);
    return true;
  }
}
