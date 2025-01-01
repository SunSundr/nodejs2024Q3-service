import { readFileSync } from 'fs';

export function loadEnv(filePath: string = '.env'): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        continue;
      }

      const commentIndex = trimmedLine.indexOf('#');
      const sanitizedLine =
        commentIndex !== -1 ? trimmedLine.slice(0, commentIndex).trim() : trimmedLine;

      if (!sanitizedLine) {
        continue;
      }

      const separatorIndex = sanitizedLine.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const keyTrimmed = sanitizedLine.slice(0, separatorIndex).trim();
      const value = sanitizedLine.slice(separatorIndex + 1).trim();

      if (!process.env[keyTrimmed]) {
        process.env[keyTrimmed] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (err) {
    console.error(`Error loading .env file at ${filePath}:`, err.message);
  }
}
