import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsIn(['video', 'audio', 'article', 'game'])
  type: 'video' | 'audio' | 'article' | 'game';

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  // opcional: marcar como destacado (no existe en DB; se maneja en memoria si no quieres alterar schema)
  // Si quieres persistirlo, avísame y añadimos la columna.
}