import {
  // IsUUID,
  IsNotEmpty,
  IsString,
  ValidateIf,
  MinLength,
  MaxLength,
  // Matches,
} from 'class-validator';
// import { UUID } from 'crypto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @ValidateIf((dto) => dto.oldPassword === undefined && dto.newPassword === undefined)
  @IsNotEmpty({ message: 'Login cannot be empty' })
  @IsString()
  login?: string;

  @ValidateIf((dto) => dto.login === undefined)
  @IsNotEmpty({
    message: 'Old password cannot be empty if new password is provided',
  })
  @IsString()
  oldPassword: string;

  @ValidateIf((dto) => dto.login === undefined)
  @IsNotEmpty({
    message: 'New password cannot be empty if old password is provided',
  })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be no longer than 32 characters' })
  // @Matches(/\d/, { message: 'Password must contain at least one number' })
  // @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  // @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  // @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@$!%*?&)' })
  newPassword: string;
}
