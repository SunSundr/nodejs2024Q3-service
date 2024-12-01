import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/user.dto';
import { User } from 'src/users/user.model';
import { LoginData, LoginDataWithToken } from './auth.login.interface';
import { JWT_DEFAULT } from 'src/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.findByLogin(createUserDto.login);
    if (user) {
      throw new ConflictException(`User "${createUserDto.login}" already exists`);
    }
    return this.usersService.createUser(createUserDto);
  }

  async login(createUserDto: CreateUserDto): Promise<LoginDataWithToken> {
    const user = await this.usersService.findByLogin(createUserDto.login);
    if (!user || !(await user.checkPassword(createUserDto.password))) {
      throw new ForbiddenException('User with such login and password not found');
    }
    return await this.getTokens({ userId: user.id, login: user.login });
  }

  async refreshToken(refreshTokenOld: string | null | undefined) {
    if (!refreshTokenOld) {
      throw new UnauthorizedException('RefreshToken should be provided');
    }

    if (refreshTokenOld.split('.').length !== 3) {
      throw new ForbiddenException('Invalid token format');
    }

    try {
      const loginData = await this.jwtService.verifyAsync(refreshTokenOld);
      return await this.getTokens({ userId: loginData.userId, login: loginData.login });
    } catch (err) {
      throw new ForbiddenException(
        `Verify token error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  private async getTokens(loginData: LoginData): Promise<LoginDataWithToken> {
    return {
      ...loginData,
      accessToken: await this.jwtService.signAsync(loginData, {
        expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME', JWT_DEFAULT.tokenExpireTime),
      }),
      refreshToken: await this.jwtService.signAsync(loginData, {
        expiresIn: this.configService.get<string>(
          'TOKEN_REFRESH_EXPIRE_TIME',
          JWT_DEFAULT.tokenRefreshExpireTime,
        ),
      }),
    };
  }
}
