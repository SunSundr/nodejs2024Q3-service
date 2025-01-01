import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export async function hashFile(filePath: string, algorithm = 'sha256'): Promise<string> {
  if (!filePath) {
    console.error('Error: filePath is required');
    return;
  }

  try {
    const result = await new Promise<string>((resolve, reject) => {
      const hash = createHash(algorithm);
      const stream = createReadStream(filePath);

      stream.on('data', (chunk) => {
        hash.update(chunk);
      });

      stream.on('end', () => {
        resolve(hash.digest('hex'));
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });

    return result;
  } catch (err) {
    console.error(`Error computing hash for file ${filePath}: ${err.message}`);
  }
}
