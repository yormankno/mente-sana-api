import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateNotificationDto {
  @IsInt() @Min(1)
  userId: number;

  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsOptional()
  message?: string;
}