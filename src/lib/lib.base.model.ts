import { UUID } from 'crypto';
import { serialize } from '../common/utils/serialize';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/users/user.model';

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
}
