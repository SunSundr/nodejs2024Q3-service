import { Entity, PrimaryColumn, Column, VersionColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UUID } from 'crypto';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { serialize } from '../common/utils/serialize';
import { checkPassword, getHash } from 'src/common/utils/hash';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  readonly id: UUID;

  @Column({ unique: true })
  login: string;

  @Column('varchar', { length: 255, select: false })
  private password: string; // hash string

  @VersionColumn()
  version: number;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  readonly createdAt: number;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  updatedAt: number;

  private constructor(login: string, password: string) {
    this.id = crypto.randomUUID() as UUID;
    this.login = login;
    this.password = getHash(password);
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = this.createdAt;
  }

  static createFromDto(createDto: CreateUserDto): User {
    return new User(createDto.login, createDto.password);
  }

  updateFromDto(updateDto: UpdateUserDto): void {
    this.login = updateDto.login || this.login;
    const newPasswordHash = getHash(updateDto.newPassword);
    if (newPasswordHash) this.password = newPasswordHash;
    this.version++;
    this.updatedAt = Date.now();
  }

  @BeforeInsert()
  @BeforeUpdate()
  protected async hashPassword(): Promise<void> {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = getHash(this.password)!;
    }
  }

  async checkPassword(newPassword: string): Promise<boolean> {
    if (newPassword === this.password) return false;
    return !(await checkPassword(newPassword, this.password));
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['password']);
  }
}
