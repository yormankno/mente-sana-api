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
      
       this.mailService.sendMail(
        recipient.email,
        text,
        `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🌿 Recordatorio de cuidado</title>
  <style>
    html, body { margin:0; padding:0; background:#f6f7fb; }
    table { border-spacing:0; }
    img { border:0; display:block; }
    a { text-decoration:none; }

    .font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
    .card { background:#ffffff; border-radius:14px; box-shadow:0 1px 2px rgba(0,0,0,0.06); }
    .px { padding-left:24px; padding-right:24px; }
    .py { padding-top:24px; padding-bottom:24px; }

    .btn { display:inline-block; padding:12px 18px; border-radius:12px; font-weight:600; font-size:14px; }
    .btn-primary { background:#2563eb; color:#ffffff !important; }
    .btn-muted { background:#e5e7eb; color:#111827 !important; }

    .badge { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; background:#ecfeff; color:#155e75; }

    @media only screen and (max-width:600px){
      .container { width:100% !important; }
      .px { padding-left:16px !important; padding-right:16px !important; }
    }
  </style>
</head>
<body class="font" style="margin:0; padding:0; background:#f6f7fb;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    🌬️ ${description}
  </div>

  <center style="width:100%; background:#f6f7fb;">
    <table role="presentation" width="100%" style="max-width:640px; margin:0 auto;" class="container">
      <tr>
        <td class="px py">

          <table role="presentation" width="100%" class="card" style="background:#0f172a; color:#ffffff; border-radius:14px;">
            <tr>
              <td style="padding:20px 24px;">
                <table role="presentation" width="100%">
                  <tr>
                    <td align="left" style="font-weight:700; font-size:18px;">🌱 MenteSana</td>
                    <td align="right" style="font-size:12px; opacity:.9;">💌 Recordatorio de cuidado</td>
                  </tr>
                </table>
                <div style="margin-top:8px; font-size:12px; color:#cbd5e1;">Automático • No responder</div>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" class="card" style="margin-top:16px; border-radius:14px;">
            <tr>
              <td style="padding:24px;">
                <div class="badge">💖 Bienestar</div>
                <h1 style="margin:12px 0 8px; font-size:22px; line-height:1.3; color:#0f172a;">🌬️ ${text}</h1>
                <p style="margin:0; font-size:15px; line-height:1.65; color:#334155;">
                  🧘‍♂️ Tómate un momento para pensar y respirar profundamente.
                </p>
                <div style="margin-top:20px;">
                  <a href="http://localhost:8080" class="btn btn-primary">📲 Abrir la app</a>
                  <span style="display:inline-block; width:8px;"></span>
                </div>

                <p style="margin:18px 0 0; font-size:12px; color:#64748b;">Si no esperabas este correo, puedes ignorarlo con tranquilidad 😊.</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" style="margin-top:12px;">
            <tr>
              <td align="center" style="font-size:12px; color:#94a3b8; padding:8px 0 32px;">
                © 2025 MenteSana • Enviado automáticamente desde el sistema de recordatorios 🌿
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`,
      );
    }

  }

}