import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class MarkManyDto {
  @IsArray() @ArrayNotEmpty()
  ids: number[];

  // opcionalmente puedes validar que todos sean ints >=1
  // pero lo mínimo práctico suele bastar
}