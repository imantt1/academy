import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Lesson } from '../entities/lesson.entity';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Lesson, Quiz, Question])],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
