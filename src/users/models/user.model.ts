// import { UUID } from 'crypto';
import { CreateUserDto, UpdateUserDto } from '../dto/dto';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';

export class User {
  readonly id: UUID;
  login: string;
  password: string;
  version: number;
  readonly createdAt: number;
  updatedAt: number;

  private constructor(login: string, password: string) {
    this.id = uuidv4() as UUID;
    this.login = login;
    this.password = password;
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
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

  toJSON() {
    const excludeProps = ['password'];
    const json = Object.fromEntries(
      Object.entries(this).filter(
        ([key, value]) =>
          typeof value !== 'function' && !excludeProps.includes(key),
      ),
    );

    return json;
  }
}
