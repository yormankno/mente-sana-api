import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { MarkManyDto } from './dto/mark-many.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // MN-18: Crear notificaciones
  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    const noti = await this.service.create(dto);
    await this.service.sendAllNotifications(noti.title, noti.message);
    return noti
  }

  // MN-21: Listar notificaciones
  @Get()
  findAll(@Query() query: ListNotificationsDto) {
    return this.service.findAll(query);
  }
  
  // MN-12: Recordatorio actividad social
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // MN-19: Editar notificaciones
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNotificationDto) {
    return this.service.update(id, dto);
  }

  // MN-20: Borrar notificaciones
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

  @Post('send/all')
  sendAllNotifications() {
    return this.service.sendAllNotifications("mensaje de prueba", "asunto de prueba");
  }
}

// MN-10: Notificaciones
// MN-11: Recordatorio hidratación
// MN-12: Recordatorio actividad social
// MN-13: Recordatorio ejercicios de relajación
// MN-14: Recordatorio descanso
// MN-15: Recordatorio descanso ocular
// MN-16: Consejos de autocuidado
// MN-17: Frases motivacionales
// MN-18: Crear notificaciones
// MN-19: Editar notificaciones
// MN-20: Borrar notificaciones
// MN-21: Listar notificaciones