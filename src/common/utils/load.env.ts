import { ENV_LOADED } from 'src/app.config';

export async function loadEnv(eVar: string = ENV_LOADED): Promise<void> {
  if (!process.env[eVar]) {
    const dotenv = await import('dotenv');
    dotenv.config();
  }
}
