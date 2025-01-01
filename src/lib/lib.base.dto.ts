import { IsNotEmpty, IsString } from 'class-validator';

export abstract class LibBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UniversalDTO {}
