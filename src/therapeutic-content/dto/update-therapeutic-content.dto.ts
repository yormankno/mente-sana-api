import { PartialType } from '@nestjs/mapped-types';
import { CreateTherapeuticContentDto } from './create-therapeutic-content.dto';

export class UpdateTherapeuticContentDto extends PartialType(CreateTherapeuticContentDto) {}
