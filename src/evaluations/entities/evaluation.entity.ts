import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EvaluationQuestion } from './evaluation-question.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.evaluations, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  type: string;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  result: string;

  @OneToMany(() => EvaluationQuestion, (question) => question.evaluation, { cascade: true })
  questions: EvaluationQuestion[];

  @CreateDateColumn()
  createdAt: Date;
}