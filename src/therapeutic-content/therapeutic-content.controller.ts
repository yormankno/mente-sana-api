import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ContentService } from './therapeutic-content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ListContentDto } from './dto/list-content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  bulkCreate(@Body() body: { items: CreateContentDto[] }) {
    return this.service.bulkCreate(body.items ?? []);
  }

  @Get()
  findAll(@Query() query: ListContentDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/related')
  related(@Param('id', ParseIntPipe) id: number) {
    return this.service.related(id);
  }
}