import * as bcrypt from 'bcrypt';

export function getHash(data: string | undefined): string | null {
  if (!data) return null;
  const saltRounds = parseInt(process.env.CRYPT_SALT || '10', 10);
  return bcrypt.hashSync(data, saltRounds);
}

export async function checkPassword(
  newPassword: string,
  existPasswordEncrypted: string,
): Promise<boolean> {
  return await bcrypt.compare(newPassword, existPasswordEncrypted);
}
