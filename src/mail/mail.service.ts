import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';



@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Servidor SMTP
      port: 465,
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: 'yormankno@gmail.com',
        pass: process.env.PASSGMAIL, // Usa contraseña de aplicación si es Gmail
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const info = await this.transporter.sendMail({
      from: '"Mi App" <tu-correo@gmail.com>',
      to,
      subject,
      html,
    });

    console.log('Correo enviado:', info.messageId);
    return info;
  }
}
