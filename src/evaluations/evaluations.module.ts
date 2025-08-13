import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { Evaluation } from './entities/evaluation.entity';
import { EvaluationQuestion } from './entities/evaluation-question.entity';
import { User } from '../users/entities/user.entity';
import { EvaluationsBase } from './entities/evaluations_base.entity';
import { QuestionsBase } from './entities/questions_base.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation, EvaluationQuestion, User, EvaluationsBase, QuestionsBase])],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}