import { IsNotEmpty, IsString } from 'class-validator';

export abstract class BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
