import { UpdateUserDto } from 'src/users/user.dto';
import { User } from '../users/user.model';
import { UUID } from 'crypto';

export interface IUserRepository {
  getById(id: UUID): Promise<User | null>;
  getByLogin(login: string): Promise<User | null>;
  getUserWithPasswordById(id: UUID): Promise<User | null>;
  updateEntity(user: User, updateDto: UpdateUserDto): Promise<User>;
  getAll(): Promise<User[]>;
  saveEntyty(user: User): Promise<User>;
  deleteByID(id: UUID): Promise<void>;
}
