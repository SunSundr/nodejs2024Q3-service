import { UUID } from 'crypto';

export interface LoginData {
  userId: UUID;
  login: string;
}

export interface LoginDataWithToken extends LoginData {
  accessToken: string;
  refreshToken: string;
}
