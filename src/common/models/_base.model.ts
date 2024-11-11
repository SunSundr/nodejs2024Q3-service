import { UUID } from 'crypto';
import { serialize } from '../utils/serialize';

export abstract class BaseLibClass {
  public id: UUID;
  public favorite = false;

  constructor(public userId: string | null = null) {
    this.id = crypto.randomUUID() as UUID;
  }

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['userId', 'favorite']);
  }
}
