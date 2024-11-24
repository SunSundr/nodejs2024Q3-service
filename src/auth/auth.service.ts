import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/user.dto';
import { User } from 'src/users/user.model';
import { LoginData, LoginDataWithToken } from './auth.login.interface';
import { loadEnv } from 'src/common/utils/load.env';

loadEnv(); // for dev-mode

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginData): Promise<LoginDataWithToken> {
    return {
      ...loginData,
      accessToken: await this.jwtService.signAsync(loginData, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      }),
      refreshToken: await this.jwtService.signAsync(loginData, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      }),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  async refreshToken(refreshTokenOld: string | null | undefined) {
    if (!refreshTokenOld) {
      throw new UnauthorizedException('RefreshToken should be provided');
    }

    if (refreshTokenOld.split('.').length !== 3) {
      throw new ForbiddenException('Invalid token format');
    }
    try {
      const loginData: LoginData = await this.jwtService.verifyAsync(refreshTokenOld);
      return this.login({ userId: loginData.userId, login: loginData.login });
    } catch (err) {
      throw new ForbiddenException(
        `Verify token error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
