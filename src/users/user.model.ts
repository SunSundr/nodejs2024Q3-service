import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UUID } from 'crypto';
import { serialize } from 'src/common/utils/serialize';

export class User {
  readonly id: UUID;
  login: string;
  private password: string;
  version: number;
  readonly createdAt: number;
  updatedAt: number;

  private constructor(login: string, password: string) {
    this.id = crypto.randomUUID() as UUID;
    this.login = login;
    this.password = password;
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = this.createdAt;
  }

  static createFromDto(createDto: CreateUserDto): User {
    return new User(createDto.login, createDto.password);
  }

  updateFromDto(updateDto: UpdateUserDto): void {
    this.login = updateDto.login || this.login;
    this.password = updateDto.newPassword || this.password;
    this.version++;
    this.updatedAt = Date.now();
  }

  async checkPassword(newPassword: string): Promise<boolean> {
    return this.password !== newPassword;
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['password']);
  }
}
