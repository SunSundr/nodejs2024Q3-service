import { Injectable, Provider } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from '../users/user.model';
import { IUserRepository } from './users.repo.interface';
import { UpdateUserDto } from 'src/users/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { USERS_REPOSITORY_TOKEN } from './tokens';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  private static instance: UserPrismaRepository;
  static provider(): Provider {
    return {
      provide: USERS_REPOSITORY_TOKEN,
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) =>
        this.instance || (this.instance = new UserPrismaRepository(prisma)),
    };
  }

  private readonly userWithPasswordselect = {
    id: true,
    login: true,
    password: true,
    version: true,
    createdAt: true,
    updatedAt: true,
  };
  constructor(private readonly prisma: PrismaService) {
    console.log('>> Init UserPrismaRepository');
  }

  async saveEntyty(user: User): Promise<User> {
    await this.prisma.user.create({
      data: user.toPrismaEntity(),
    });
    return user;
  }

  async updateEntity(user: User, updateDto: UpdateUserDto): Promise<User> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: updateDto.newPassword },
    });
    return user;
  }

  async getUserWithPasswordById(id: UUID): Promise<User | null> {
    const pUser = await this.prisma.user.findUnique({
      where: { id },
      select: this.userWithPasswordselect,
    });
    return pUser ? User.createFromPrisma(pUser) : null;
  }

  async getById(id: UUID): Promise<User | null> {
    const pUser = await this.prisma.user.findUnique({
      where: { id },
    });
    return pUser ? User.createFromPrisma(pUser) : null;
  }

  async getAll(): Promise<User[]> {
    const pUsers = await this.prisma.user.findMany();
    return pUsers.map((pUser) => User.createFromPrisma(pUser));
  }

  async deleteByID(id: UUID): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getByLogin(login: string): Promise<User | null> {
    const pUser = await this.prisma.user.findUnique({
      where: { login },
      select: this.userWithPasswordselect,
    });
    return pUser ? User.createFromPrisma(pUser) : null;
  }
}
