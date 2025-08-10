import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { MarkManyDto } from './dto/mark-many.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // Crear notificación
  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  // Listar (con filtros/paginación)
  @Get()
  findAll(@Query() query: ListNotificationsDto) {
    return this.service.findAll(query);
  }

  // Obtener una
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Actualizar título/mensaje
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNotificationDto) {
    return this.service.update(id, dto);
  }

  // Eliminar
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ---- Acciones específicas ----

  // Marcar una como leída
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markAsRead(id);
  }

  // Marcar una como NO leída
  @Patch(':id/unread')
  markAsUnread(@Param('id', ParseIntPipe) id: number) {
    return this.service.markAsUnread(id);
  }

  // Marcar muchas como leídas
  @Patch('read')
  markManyAsRead(@Body() dto: MarkManyDto) {
    return this.service.markManyAsRead(dto);
  }

  // Marcar todas como leídas para un usuario
  @Patch('user/:userId/read-all')
  markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.markAllAsReadForUser(userId);
  }
}