import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TherapeuticContent } from 'src/therapeutic-content/entities/therapeutic-content.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Evaluation } from 'src/evaluations/entities/evaluation.entity';
import { EvaluationQuestion } from 'src/evaluations/entities/evaluation-question.entity';
// agrega aquí más entidades cuando las tengas

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User,TherapeuticContent,Notification, Evaluation,EvaluationQuestion], // agrega Notification, Evaluation, etc. cuando estén
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // producción: false
  logging: false,
});