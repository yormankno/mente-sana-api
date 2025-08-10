import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {

  constructor(@InjectRepository(Notification) private readonly noti: Repository<Notification>) {}

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  async findAll() {
    const data = await this.noti.find();
    return data;
  }

  async findOne(id: number) {
    const notificatioData = await this.noti.findOne({where:{id}});
  if (!notificatioData) throw new NotFoundException("numero no valido");

    return notificatioData;
    
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
