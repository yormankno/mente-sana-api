import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EvalQuestionDto } from './create-evaluation.dto';

export class UpdateEvaluationDto {
  // Reemplaza el set de preguntas/respuestas completo (o envía solo las que cambian)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvalQuestionDto)
  questions?: EvalQuestionDto[];
}