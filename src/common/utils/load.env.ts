import { readFileSync } from 'fs';

export function loadEnv(filePath: string = '.env'): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const [key, ...valueParts] = trimmedLine.split('=');
      const keyTrimmed = key.trim();

      const value = valueParts.join('=').trim();

      if (!process.env[keyTrimmed]) {
        process.env[keyTrimmed] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (err) {
    console.error(`Error loading .env file at ${filePath}:`, err.message);
  }
}
