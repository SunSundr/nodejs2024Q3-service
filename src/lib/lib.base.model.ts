import { UUID } from 'crypto';
import { serialize } from '../common/utils/serialize';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Prisma } from '@prisma/client';
import { User } from 'src/users/user.model';
import { toPrismaEntity } from 'src/prisma/prisma.converter';

export abstract class BaseLibClass {
  @PrimaryColumn('uuid')
  public readonly id: UUID;

  @Column({ nullable: true })
  public userId: UUID | null;

  @Column({ default: false })
  public favorite: boolean;

  // relations
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User | null;

  protected constructor(userId: UUID | null = null) {
    this.id = crypto.randomUUID() as UUID;
    this.userId = userId;
    this.favorite = false;
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['user', 'userId', 'favorite']);
  }

  toPrismaEntity(): Prisma.artistDelegate | Prisma.trackDelegate | Prisma.albumDelegate {
    return toPrismaEntity(this);
  }
}
