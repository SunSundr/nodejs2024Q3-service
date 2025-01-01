import {
  IsNotEmpty,
  IsString,
  ValidateIf,
  MinLength,
  MaxLength,
  // Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The login of the user',
    type: String,
    example: 'TestUser',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description:
      'The login of the user. This field is optional unless no password fields are provided.',
    type: String,
    example: 'UpdatedUserLogin',
  })
  @ValidateIf((dto) => dto.oldPassword === undefined && dto.newPassword === undefined)
  @IsNotEmpty({ message: 'Login cannot be empty' })
  @IsString()
  login?: string;

  @ApiProperty({
    description: 'The old password of the user (required if new password is provided)',
    type: String,
    example: 'oldpassword123',
  })
  @ValidateIf((dto) => dto.login === undefined)
  @IsNotEmpty({
    message: 'Old password cannot be empty if new password is provided',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password for the user (required if old password is provided)',
    type: String,
    example: 'newpassword123',
  })
  @ValidateIf((dto) => dto.login === undefined)
  @IsNotEmpty({
    message: 'New password cannot be empty if old password is provided',
  })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @MaxLength(32, { message: 'Password must be no longer than 32 characters' })
  // @Matches(/\d/, { message: 'Password must contain at least one number' })
  // @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  // @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  // @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@$!%*?&)' })
  newPassword: string;
}

export class OutputUserDTO {
  @ApiProperty({
    description: 'Unique identifier of the user (UUID v4)',
    type: String,
    format: 'uuid',
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'The login of the user',
    type: String,
    example: 'TestUser',
  })
  login: string;

  @ApiProperty({
    description: 'Version of the user entity, increments on update',
    type: Number,
    example: 1,
  })
  version: number; // integer number, increments on update

  @ApiProperty({
    description: 'Timestamp of when the user was created',
    type: Number,
    example: 1655000000,
  })
  createdAt: number; // timestamp of creation

  @ApiProperty({
    description: 'Timestamp of the last update of the user',
    type: Number,
    example: 1655000000,
  })
  updatedAt: number; // timestamp of last update
}
