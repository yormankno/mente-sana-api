import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { ListEvaluationsDto } from './dto/list-evaluations.dto';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Post()
  create(@Body() dto: CreateEvaluationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: ListEvaluationsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Extras
  @Get('user/:userId/latest/:type')
  latestByType(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('type') type: string,
  ) {
    return this.service.latestByType(userId, type);
  }

  @Get('user/:userId/summary')
  summary(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.summary(userId);
  }
}