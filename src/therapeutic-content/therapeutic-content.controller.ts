import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TherapeuticContentService } from './therapeutic-content.service';
import { CreateTherapeuticContentDto } from './dto/create-therapeutic-content.dto';
import { UpdateTherapeuticContentDto } from './dto/update-therapeutic-content.dto';

@Controller('therapeutic-content')
export class TherapeuticContentController {
  constructor(private readonly therapeuticContentService: TherapeuticContentService) {}

  @Post()
  create(@Body() createTherapeuticContentDto: CreateTherapeuticContentDto) {
    return this.therapeuticContentService.create(createTherapeuticContentDto);
  }

  @Get()
  findAll() {
    return this.therapeuticContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.therapeuticContentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTherapeuticContentDto: UpdateTherapeuticContentDto) {
    return this.therapeuticContentService.update(+id, updateTherapeuticContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.therapeuticContentService.remove(+id);
  }
}
