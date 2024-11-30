import { Controller, Post, Body, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginData } from './auth.login.interface';
import { RefreshTokenDto } from './auth.refresh.dto';
import { Public } from 'src/common/utils/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  @Public()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findByLogin(createUserDto.login);
    if (user) {
      throw new ForbiddenException(`User "${createUserDto.login}" already exists`);
    }
    return await this.authService.signup(createUserDto);
  }

  @Post('login')
  @Public()
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: 403,
    description: 'Authentication failed. No user with such login, password',
  })
  async login(@Body() createUserDto: CreateUserDto): Promise<LoginData> {
    const user = await this.userService.findByLogin(createUserDto.login);
    if (!user) {
      throw new ForbiddenException(`Incorrect login ${createUserDto.login}`);
    }
    return await this.authService.login({ userId: user.id, login: user.login });
  }

  @Post('refresh')
  @Public()
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid token' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Authentication failed' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginData> {
    return await this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
