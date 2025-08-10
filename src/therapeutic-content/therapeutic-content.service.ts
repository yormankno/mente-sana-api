import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TherapeuticContent } from './entities/therapeutic-content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ListContentDto } from './dto/list-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(TherapeuticContent)
    private readonly repo: Repository<TherapeuticContent>,
  ) {}

  async create(dto: CreateContentDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateContentDto) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Contenido no encontrado');
    Object.assign(found, dto);
    return this.repo.save(found);
  }

  async remove(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Contenido no encontrado');
    await this.repo.delete(id);
    return { ok: true };
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Contenido no encontrado');
    return found;
  }

  async findAll(query: ListContentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    // Construcción de filtros
    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;

    // Rango de fechas
    if (query.from && query.to) where.createdAt = Between(new Date(query.from), new Date(query.to));
    else if (query.from) where.createdAt = MoreThanOrEqual(new Date(query.from));
    else if (query.to) where.createdAt = LessThanOrEqual(new Date(query.to));

    // Búsqueda básica
    // Para buscar en title y description con OR:
    // usa un findAndCount con "where: [{...where, title: ILike('%q%')}, {...where, description: ILike('%q%')} ]"
    if (query.search) {
      const q = ILike(`%${query.search}%`);
      const [data, total] = await this.repo.findAndCount({
        where: [
          { ...where, title: q },
          { ...where, description: q },
        ],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      return { data, total, page, limit };
    }

    // Sin búsqueda OR
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  /** Sugerencias simples por tipo/categoría (útil para “más como esto”) */
  async related(id: number, take = 6) {
    const current = await this.repo.findOne({ where: { id } });
    if (!current) throw new NotFoundException('Contenido no encontrado');

    return this.repo.find({
      where: [
        { type: current.type, category: current.category },
        { type: current.type },
        { category: current.category },
      ],
      order: { createdAt: 'DESC' },
      take,
    });
  }

  /** Crear en lote (por ejemplo, cargar catálogo inicial) */
  async bulkCreate(items: CreateContentDto[]) {
    const entities = this.repo.create(items);
    const saved = await this.repo.save(entities);
    return { inserted: saved.length, data: saved };
  }
}