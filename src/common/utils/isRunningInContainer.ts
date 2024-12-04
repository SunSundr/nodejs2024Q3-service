import { existsSync } from 'fs';

export function isRunningInContainer() {
  return existsSync('/.dockerenv');
}
