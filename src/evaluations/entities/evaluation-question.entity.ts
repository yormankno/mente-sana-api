import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Evaluation } from './evaluation.entity';

@Entity('evaluation_questions')
export class EvaluationQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.questions, { onDelete: 'CASCADE' })
  evaluation: Evaluation;

  @Column()
  question: string;

  @Column({ nullable: true })
  answer: string;
}