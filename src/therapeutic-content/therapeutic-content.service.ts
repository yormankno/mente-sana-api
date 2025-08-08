import { Injectable } from '@nestjs/common';
import { CreateTherapeuticContentDto } from './dto/create-therapeutic-content.dto';
import { UpdateTherapeuticContentDto } from './dto/update-therapeutic-content.dto';

@Injectable()
export class TherapeuticContentService {
  create(createTherapeuticContentDto: CreateTherapeuticContentDto) {
    return 'This action adds a new therapeuticContent';
  }

  findAll() {
    return `This action returns all therapeuticContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} therapeuticContent`;
  }

  update(id: number, updateTherapeuticContentDto: UpdateTherapeuticContentDto) {
    return `This action updates a #${id} therapeuticContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} therapeuticContent`;
  }
}
