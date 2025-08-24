import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, LessThanOrEqual, Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { EvaluationQuestion } from './entities/evaluation-question.entity';
import { User } from '../users/entities/user.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { ListEvaluationsDto } from './dto/list-evaluations.dto';
import { EvaluationsBase } from './entities/evaluations_base.entity';

/** Helpers de scoring **/
function normalizeAnswerToNumber(a?: string | number): number {
  if (a === undefined || a === null) return 0;
  if (typeof a === 'number') return a;
  const trimmed = String(a).trim().toLowerCase();
  // Mapea strings frecuentes a puntajes
  const map: Record<string, number> = {
    '0': 0, 'ninguno': 0, 'nada': 0, 'never': 0,
    '1': 1, 'varios días': 1, 'poco': 1, 'several days': 1,
    '2': 2, 'más de la mitad de los días': 2, 'moderado': 2, 'more than half': 2,
    '3': 3, 'casi todos los días': 3, 'severo': 3, 'nearly every day': 3,
    '4': 4 // por si alguna escala usara 0-4
  };
  return map[trimmed] ?? (Number.isFinite(Number(trimmed)) ? Number(trimmed) : 0);
}

function computeScoreAndResult(type: string, answersNumeric: number[]) {
  const total = answersNumeric.reduce((a, b) => a + b, 0);

  // console.log(`Evaluación tipo: ${type}, respuestas: ${answersNumeric}, total: ${total}`);

  // if (type === 'PHQ-9') {
  //   // Rangos PHQ-9: 0–4 ninguno; 5–9 leve; 10–14 moderado; 15–19 moderadamente severo; 20–27 severo
  //   let result = 'none';
  //   if (total >= 5 && total <= 9) result = 'mild';
  //   else if (total >= 10 && total <= 14) result = 'moderate';
  //   else if (total >= 15 && total <= 19) result = 'moderately severe';
  //   else if (total >= 20) result = 'severe';
  //   return { score: total, result };
  // }

  // if (type === 'GAD-7') {
  //   // Rangos GAD-7: 0–4 mínimo; 5–9 leve; 10–14 moderado; 15–21 severo
  //   let result = 'minimal';
  //   if (total >= 5 && total <= 9) result = 'mild';
  //   else if (total >= 10 && total <= 14) result = 'moderate';
  //   else if (total >= 15) result = 'severe';
  //   return { score: total, result };
  // }


  const numQuestions = answersNumeric.length;
  const avg = numQuestions > 0 ? total / numQuestions : 0;

  let result = 'severa';
  if (avg >= 2 && avg < 3) result = 'moderado';
  else if (avg >= 3 && avg < 4) result = 'leve';
  else if (avg >= 4) result = 'mínima';

  return { score: total, result };

}

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation) private readonly evalRepo: Repository<Evaluation>,
    @InjectRepository(EvaluationQuestion) private readonly qRepo: Repository<EvaluationQuestion>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(EvaluationsBase) private readonly evaluationsBase: Repository<EvaluationsBase>
  ) { }

  /** Crear evaluación con preguntas */
  async create(dto: CreateEvaluationDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const numericAnswers = dto.questions.map(q => normalizeAnswerToNumber(q.answer));
    const { score, result } = computeScoreAndResult(dto.type, numericAnswers);

    const evaluation = this.evalRepo.create({
      user,
      type: dto.type,
      score,
      result,
      questions: dto.questions.map((q) =>
        this.qRepo.create({
          question: q.question,
          answer: q.answer !== undefined ? String(q.answer) : undefined,
        }),
      ),
    });

    return this.evalRepo.save(evaluation);

  }

  /** Actualizar respuestas (recalcula score) */
  async update(id: number, dto: UpdateEvaluationDto) {
    const evaluation = await this.evalRepo.findOne({ where: { id }, relations: ['questions', 'user'] });
    if (!evaluation) throw new NotFoundException('Evaluación no encontrada');

    if (dto.questions?.length) {
      // estrategia simple: reemplazar o fusionar por 'question' como clave
      const mapIncoming = new Map(dto.questions.map(q => [q.question.trim(), q]));
      for (const q of evaluation.questions) {
        const incoming = mapIncoming.get(q.question.trim());
        if (incoming) q.answer = incoming.answer !== undefined ? String(incoming.answer) : q.answer;
      }
      // agregar nuevas preguntas no existentes
      for (const inc of dto.questions) {
        const exists = evaluation.questions.some(q => q.question.trim() === inc.question.trim());
        if (!exists) {
          evaluation.questions.push(this.qRepo.create({
            evaluation,
            question: inc.question,
            answer: inc.answer !== undefined ? String(inc.answer) : undefined,
          }));
        }
      }
    }

    // Recalcular score
    const answersNumeric = evaluation.questions.map(q => normalizeAnswerToNumber(q.answer));
    const { score, result } = computeScoreAndResult(evaluation.type, answersNumeric);
    evaluation.score = score;
    evaluation.result = result;

    return this.evalRepo.save(evaluation);
  }

  /** Eliminar evaluación */
  async remove(id: number) {
    const evaluation = await this.evalRepo.findOne({ where: { id } });
    if (!evaluation) throw new NotFoundException('Evaluación no encontrada');
    await this.evalRepo.delete(id);
    return { ok: true };
  }

  /** Obtener una evaluación (con preguntas) */
  async findOne(id: number) {
    const evaluation = await this.evalRepo.findOne({ where: { id }, relations: ['questions', 'user'] });
    if (!evaluation) throw new NotFoundException('Evaluación no encontrada');
    return evaluation;
  }

  /** Listado con filtros y paginación */
  async findAll(query: ListEvaluationsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: any = {};
    if (query.userId) where.user = { id: query.userId };
    if (query.type) where.type = query.type;

    // filtros de fecha
    if (query.from && query.to) where.createdAt = Between(new Date(query.from), new Date(query.to));
    else if (query.from) where.createdAt = MoreThanOrEqual(new Date(query.from));
    else if (query.to) where.createdAt = LessThanOrEqual(new Date(query.to));

    const [data, total] = await this.evalRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['questions', 'user'],
    });

    return { data, total, page, limit };
  }

  /** Última evaluación por tipo para un usuario (útil para dashboard) */
  async latestByType(userId: number, type: string) {
    const evaluation = await this.evalRepo.findOne({
      where: { user: { id: userId }, type },
      order: { createdAt: 'DESC' },
      relations: ['questions', 'user'],
    });
    if (!evaluation) throw new NotFoundException('No hay evaluaciones para ese tipo');
    return evaluation;
  }

  /** Resumen por usuario: último score por tipo + conteos */
  async summary(userId: number) {
    const rows = await this.evalRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const byType = new Map<string, Evaluation[]>();
    rows.forEach(r => {
      const arr = byType.get(r.type) ?? [];
      arr.push(r);
      byType.set(r.type, arr);
    });

    const summary = Array.from(byType.entries()).map(([type, list]) => ({
      type,
      count: list.length,
      lastScore: list[0].score,
      lastResult: list[0].result,
      lastDate: list[0].createdAt,
    }));

    return { userId, summary };
  }

  async getEvaluationsBaseAll() {
    const evaluations = await this.evaluationsBase.find(
      {
        relations: ['questions'], // Nombre del OneToMany en la entidad
      }
    );
    return evaluations;
  }
}

// MN-22: Evaluación Diagnóstico e Intervención
// MN-23: Evaluación de ansiedad
// MN-24: Evaluación de depresión
// MN-25: Evaluación de bienestar
// MN-26: Evaluación de apoyo social
// MN-27: Mandar puntaje de evaluación
// MN-28: Mandar resultado de evaluación
// MN-29: Frases motivadoras