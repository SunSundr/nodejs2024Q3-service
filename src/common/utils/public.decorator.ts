import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const PUBLIC_KEY: string = 'Public';
export function Public(): CustomDecorator<typeof PUBLIC_KEY> {
  return SetMetadata(PUBLIC_KEY, true);
}
