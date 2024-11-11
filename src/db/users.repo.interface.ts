import { User } from '../users/user.model';
import { UUID } from 'crypto';

export interface IUserRepository {
  get(id: UUID): Promise<User | undefined>;
  getAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: UUID): Promise<void>;
}
