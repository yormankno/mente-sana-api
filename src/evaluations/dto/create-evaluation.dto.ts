import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EvalQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  // puede llegar como string o número (0-3/0-4 según escala); lo convertimos a string internamente
  @IsOptional()
  answer?: string | number;
}

export class CreateEvaluationDto {
  @IsInt() @Min(1)
  userId: number;

  @IsString()
  // @IsIn(['PHQ-9', 'GAD-7']) // agrega aquí más escalas que soportes
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvalQuestionDto)
  questions: EvalQuestionDto[];
}