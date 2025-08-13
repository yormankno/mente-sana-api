import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EvaluationsBase } from './evaluations_base.entity';

@Entity('questions_base')
export class QuestionsBase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EvaluationsBase, (evaluation) => evaluation.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evaluations_base_id' })
  evaluation: EvaluationsBase;

  @Column({ name: 'number_question', type: 'int' })
  numberQuestion: number;

  @Column({ name: 'text', type: 'text' })
  text: string;
}
