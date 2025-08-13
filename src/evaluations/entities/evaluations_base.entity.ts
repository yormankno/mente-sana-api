import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { QuestionsBase } from './questions_base.entity';

@Entity('evaluations_base')
export class EvaluationsBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code_eval', type: 'varchar', length: 50, unique: true })
  codeEval: string;

  @Column({ name: 'name_eval', type: 'varchar', length: 255 })
  nameEval: string;

  @Column({ name: 'score_max', type: 'int' })
  scoreMax: number;

  @Column({ name: 'form', type: 'text' })
  form: string;

  @Column({ name: 'interpretation', type: 'jsonb' })
  interpretation: any;

  @OneToMany(() => QuestionsBase, (question) => question.evaluation, { cascade: true })
  questions: QuestionsBase[];
}
