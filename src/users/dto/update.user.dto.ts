import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, IsIn, IsInt, Min } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @IsIn(['paciente', 'profesional', 'admin'])
  role?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}