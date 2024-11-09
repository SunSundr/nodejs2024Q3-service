import { User } from '../models/user.model';
// import { UserIdParamDto } from '../dto/dto';
import { UUID } from 'crypto';

export interface IUserRepository {
  get(id: UUID): Promise<User | undefined>;
  getAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  // update(id: string, updateDto: UpdateUserDto): Promise<User>;
  delete(id: UUID): Promise<void>;
}
