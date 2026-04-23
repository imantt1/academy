import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as ModuleEntity } from '../entities/module.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { CreateModuleDto } from './dto/create-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepo: Repository<ModuleEntity>,
    @InjectRepository(UserProgress)
    private progressRepo: Repository<UserProgress>,
  ) {}

  async findAll(userId?: string) {
    const modules = await this.modulesRepo.find({
      order: { order: 'ASC' },
      relations: ['lessons', 'quizzes', 'quizzes.questions'],
    });

    if (!userId) return modules;

    // Enrich with user progress
    const progress = await this.progressRepo.find({ where: { userId } });
    const progressMap = new Map(progress.map((p) => [p.moduleId, p]));

    return modules.map((mod) => ({
      ...mod,
      userProgress: progressMap.get(mod.id) || null,
    }));
  }

  async findOne(id: number, userId?: string) {
    const mod = await this.modulesRepo.findOne({
      where: { id },
      relations: ['lessons', 'quizzes', 'quizzes.questions'],
    });
    if (!mod) throw new NotFoundException(`Módulo #${id} no encontrado`);

    if (userId) {
      const progress = await this.progressRepo.findOne({
        where: { userId, moduleId: id },
      });
      return { ...mod, userProgress: progress || null };
    }

    return mod;
  }

  async create(dto: CreateModuleDto) {
    const mod = this.modulesRepo.create(dto);
    return this.modulesRepo.save(mod);
  }

  async update(id: number, dto: Partial<CreateModuleDto>) {
    await this.findOne(id);
    await this.modulesRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.modulesRepo.delete(id);
    return { message: `Módulo #${id} eliminado` };
  }
}
