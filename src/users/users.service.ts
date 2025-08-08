import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

function stripPassword(user: User | null) {
  if (!user) return null;
  // @ts-ignore
  const { password, ...rest } = user;
  return rest;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ ...dto, password: hashed });
    const saved = await this.repo.save(user);
    return stripPassword(saved);
  }

  async findAll(page = 1, limit = 20) {
    const options: FindManyOptions<User> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    };
    const [data, total] = await this.repo.findAndCount(options);
    return {
      data: data.map(stripPassword),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return stripPassword(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== user.email) {
      const emailTaken = await this.repo.findOne({ where: { email: dto.email } });
      if (emailTaken) throw new ConflictException('Email ya está registrado por otro usuario');
    }

    let toUpdate: Partial<User> = { ...dto };
    if (dto.password) {
      toUpdate.password = await bcrypt.hash(dto.password, 10);
    }

    await this.repo.update(id, toUpdate);
    const updated = await this.repo.findOne({ where: { id } });
    return stripPassword(updated);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.repo.delete(id);
    return { ok: true };
  }
}