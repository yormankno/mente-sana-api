import { IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListContentDto {
  @IsOptional() @IsString()
  search?: string; // busca en title/description

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsIn(['video', 'audio', 'article', 'game'])
  type?: 'video' | 'audio' | 'article' | 'game';

  @IsOptional() @IsDateString()
  from?: string; // ISO date

  @IsOptional() @IsDateString()
  to?: string;   // ISO date

  @IsOptional() @IsInt() @Min(1)
  page?: number;

  @IsOptional() @IsInt() @Min(1)
  limit?: number;
}