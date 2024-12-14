import { existsSync } from 'fs';
import { DOCKER_OFF } from 'src/app.config';

export function isRunningInContainer() {
  const status = existsSync('/.dockerenv');
  if (!status) process.env[DOCKER_OFF] = 'true';
  return status;
}
