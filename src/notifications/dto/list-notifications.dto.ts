import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListNotificationsDto {
  @IsOptional() @IsInt() @Min(1)
  userId?: number;

  @IsOptional() @IsIn(['unread', 'read'])
  status?: 'unread' | 'read';

  @IsOptional() @IsString()
  search?: string; // busca en title/message

  @IsOptional() @IsInt() @Min(1)
  page?: number;

  @IsOptional() @IsInt() @Min(1)
  limit?: number;
}