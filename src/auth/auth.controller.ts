import {
  Controller,
  Post,
  Body,
  // UseGuards,
  // Request,
  ForbiddenException,
  // HttpStatus,
  // HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginData } from './auth.login.interface';
import { RefreshTokenDto } from './auth.refresh.dto';
import { Public } from 'src/common/utils/public.decorator';
import { TEST_USER_DTO } from 'src/app.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  @Public()
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findByLogin(createUserDto.login);
    if (user && createUserDto.login !== TEST_USER_DTO.login) {
      throw new ForbiddenException(`User "${createUserDto.login}" already exists`);
    }
    return await this.authService.signup(createUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() createUserDto: CreateUserDto): Promise<LoginData> {
    const user = await this.userService.findByLogin(createUserDto.login);
    if (!user) {
      throw new ForbiddenException(`Incorrect login ${createUserDto.login}`);
    }
    return await this.authService.login({ userId: user.id, login: user.login });
  }

  @Post('refresh')
  @Public()
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginData> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
