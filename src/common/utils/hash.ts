import * as bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.CRYPT_SALT || '10', 10);

export function getHash(data: string | undefined): string | null {
  if (!data) return null;
  return bcrypt.hashSync(data, saltRounds);
}

export async function checkPassword(
  newPassword: string,
  existPasswordEncrypted: string,
): Promise<boolean> {
  return await bcrypt.compare(newPassword, existPasswordEncrypted);
}
