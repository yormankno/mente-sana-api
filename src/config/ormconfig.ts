import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EvaluationQuestion } from '../evaluations/entities/evaluation-question.entity';
import { User } from 'src/users/entities/user.entity';
import { Evaluation } from 'src/evaluations/entities/evaluation.entity';
import { TherapeuticContent } from 'src/therapeutic-content/entities/therapeutic-content.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Notification, Evaluation, EvaluationQuestion, TherapeuticContent],
  synchronize: true, // SOLO desarrollo
};
