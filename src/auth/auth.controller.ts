import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { LoginData, LoginDataWithToken } from './auth.login.interface';
import { RefreshTokenDto } from './auth.refresh.dto';
import { Public } from 'src/common/utils/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists',
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('login')
  @Public()
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Authentication failed. No user with such login, password',
  })
  async login(@Body() createUserDto: CreateUserDto): Promise<LoginDataWithToken> {
    return await this.authService.login(createUserDto);
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
