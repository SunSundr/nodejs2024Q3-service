import { existsSync } from 'fs';

export function isRunningInContainer(): boolean {
  return existsSync('/.dockerenv');
}
