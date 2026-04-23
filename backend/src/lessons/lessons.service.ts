import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepo: Repository<Lesson>,
  ) {}

  async findByModule(moduleId: number) {
    return this.lessonsRepo.find({
      where: { moduleId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number) {
    const lesson = await this.lessonsRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException(`Lección #${id} no encontrada`);
    return lesson;
  }

  async create(dto: CreateLessonDto) {
    const lesson = this.lessonsRepo.create(dto);
    return this.lessonsRepo.save(lesson);
  }

  async update(id: number, dto: Partial<CreateLessonDto>) {
    await this.findOne(id);
    await this.lessonsRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.lessonsRepo.delete(id);
    return { message: `Lección #${id} eliminada` };
  }
}
