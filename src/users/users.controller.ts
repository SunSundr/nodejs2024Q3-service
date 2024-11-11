import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  ParseUUIDPipe,
  NotFoundException,
  ForbiddenException,
  UsePipes,
  HttpCode,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserByIdInterceptor } from '../common/interceptors/user-by-id.interceptor';
import { UUID } from 'crypto';
import { User } from './user.model';
import { ApiTags } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getUserById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID): Promise<User> {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @Put(':id')
  @UseInterceptors(UserByIdInterceptor)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    const { user } = req;
    if (!(await user.checkPassword(updateUserDto.newPassword))) {
      throw new ForbiddenException('New password must be different from the current password');
    }
    return await this.usersService.updateUser(req.user, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(UserByIdInterceptor)
  @HttpCode(204)
  async deleteUser(@Request() req: RequestWithUser): Promise<boolean> {
    return this.usersService.delete(req.user);
  }
}
