import { Injectable, Provider } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UUID } from 'crypto';
import { User } from '../users/user.model';
import { IUserRepository } from './users.repo.interface';
import { UpdateUserDto } from 'src/users/user.dto';
import { USERS_REPOSITORY_TOKEN } from './tokens';

@Injectable()
export class UserTypeOrmRepository extends Repository<User> implements IUserRepository {
  private static instance: UserTypeOrmRepository;
  static provider(): Provider {
    return {
      provide: USERS_REPOSITORY_TOKEN,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) =>
        this.instance ||
        (this.instance = new UserTypeOrmRepository(dataSource.getRepository(User))),
    };
  }

  //constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  constructor(private readonly userRepository: Repository<User>) {
    super(User, userRepository.manager);
    console.log('Init UserTypeOrmRepository (TypeORM)');
  }

  async saveEntyty(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateEntity(user: User, updateDto: UpdateUserDto): Promise<User> {
    const partialUser = { password: updateDto.newPassword } as Partial<User>;
    await this.userRepository.update(user.id, partialUser);
    return user;
  }

  async getUserWithPasswordById(id: UUID): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    return user;
  }

  async getById(id: UUID): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteByID(id: UUID): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getByLogin(login: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.login = :login', { login })
      .getOne();
    return user;
  }
}
