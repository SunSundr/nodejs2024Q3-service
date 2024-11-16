import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from '../users/user.model';
import { IUserRepository } from './users.repo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/users/user.dto';

@Injectable()
export class UserTypeOrmRepository extends Repository<User> implements IUserRepository {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(User, userRepository.manager);
  }

  async saveEntyty(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateEntity(user: User, updateDto: UpdateUserDto): Promise<User> {
    const partialUser = { password: updateDto.newPassword } as Partial<User>;
    await this.userRepository.update(user.id, partialUser);
    return user;
}

  async getUserWithPasswordById(id: UUID): Promise<Partial<User>> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getById(id: UUID): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteByID(id: UUID): Promise<void> {
    await this.userRepository.delete(id);
    return;
  }
}
