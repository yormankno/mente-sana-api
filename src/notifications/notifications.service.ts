import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { MarkManyDto } from './dto/mark-many.dto';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) { }

  async create(dto: CreateNotificationDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const entity = this.notifRepo.create({
      user,
      title: dto.title,
      message: dto.message,
      status: 'unread',
    });
    return this.notifRepo.save(entity);
  }

  async update(id: number, dto: UpdateNotificationDto) {
    const n = await this.notifRepo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('Notificación no encontrada');
    Object.assign(n, dto);
    return this.notifRepo.save(n);
  }

  async findAll(query: ListNotificationsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: any = {};
    if (query.userId) where.user = { id: query.userId };
    if (query.status) where.status = query.status;
    if (query.search) {
      // búsqueda básica en título y mensaje
      where.title = ILike(`%${query.search}%`);
      // truco: si quieres buscar en ambos, usa un OR donde necesario
    }

    const [data, total] = await this.notifRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // contador de no leídas (útil para badge)
    let unreadCount = 0;
    if (query.userId) {
      unreadCount = await this.notifRepo.count({
        where: { user: { id: query.userId }, status: 'unread' },
      });
    }

    return { data, total, page, limit, unreadCount };
  }

  async findOne(id: number) {
    const n = await this.notifRepo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('Notificación no encontrada');
    return n;
  }

  async remove(id: number) {
    const n = await this.notifRepo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('Notificación no encontrada');
    await this.notifRepo.delete(id);
    return { ok: true };
  }

  // ---- Funcionales clave ----

  async markAsRead(id: number) {
    const n = await this.findOne(id);
    n.status = 'read';
    return this.notifRepo.save(n);
  }

  async markAsUnread(id: number) {
    const n = await this.findOne(id);
    n.status = 'unread';
    return this.notifRepo.save(n);
  }

  async markManyAsRead(dto: MarkManyDto) {
    if (!dto.ids?.length) return { updated: 0 };
    await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ status: 'read' })
      .whereInIds(dto.ids)
      .execute();
    return { updated: dto.ids.length };
  }

  async markAllAsReadForUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const result = await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ status: 'read' })
      .where('userId = :userId AND status = :status', { userId, status: 'unread' })
      .execute();

    return { updated: result.affected ?? 0 };
  }

  async sendAllNotifications(text : string, description: string) {

    const user = await this.userRepo.find()
    if (!user) throw new Error('Usuario no encontrado');
    
    for (const recipient of user) {
      console.log("EMAIL: ",recipient.email);
      await this.mailService.sendMail(
        recipient.email,
        text,
        `<p>${description}</p>`,
      );
    }

  }

}