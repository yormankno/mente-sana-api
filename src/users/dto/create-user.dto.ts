import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(['paciente', 'profesional', 'admin'])
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;
}