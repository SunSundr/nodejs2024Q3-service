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
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, OutputUserDTO } from './user.dto';
import { UserByIdInterceptor } from '../common/interceptors/user-by-id.interceptor';
import { UUID } from 'crypto';
import { User } from './user.model';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all users', type: [OutputUserDTO] })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User data', type: OutputUserDTO })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format' })
  async getUserById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: UUID): Promise<User> {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    type: OutputUserDTO,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request body' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @Put(':id')
  @UseInterceptors(UserByIdInterceptor)
  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User password updated successfully',
    type: OutputUserDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format or missing fields',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'New password must be different from the current password',
  })
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
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'User successfully deleted' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async deleteUser(@Request() req: RequestWithUser): Promise<boolean> {
    return this.usersService.delete(req.user);
  }
}
