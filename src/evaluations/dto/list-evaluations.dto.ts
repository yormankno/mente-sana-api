import { IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListEvaluationsDto {
  @IsOptional() @IsInt() @Min(1)
  userId?: number;

  @IsOptional() @IsString()
  @IsIn(['PHQ-9', 'GAD-7'])
  type?: string;

  @IsOptional() @IsDateString()
  from?: string; // ISO

  @IsOptional() @IsDateString()
  to?: string;   // ISO

  @IsOptional() @IsInt() @Min(1)
  page?: number;

  @IsOptional() @IsInt() @Min(1)
  limit?: number;
}