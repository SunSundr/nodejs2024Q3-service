import { UUID } from 'crypto';
import { serialize } from '../common/utils/serialize';
import { Column, PrimaryColumn } from 'typeorm';

export abstract class BaseLibClass {
  @PrimaryColumn('uuid')
  public readonly id: UUID;

  @Column({ nullable: true })
  public userId: UUID | null;

  @Column({ default: false })
  public favorite: boolean;

  protected constructor(userId: UUID | null = null) {
    this.id = crypto.randomUUID() as UUID;
    this.userId = userId;
    this.favorite = false;
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['userId', 'favorite']);
  }
}
