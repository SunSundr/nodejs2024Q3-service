import { serialize } from '../utils/serialize';

export abstract class BaseLibClass {
  abstract userId: string;

  toJSON(): { [key: string]: unknown } {
    return serialize(this, ['userId']);
  }
}
