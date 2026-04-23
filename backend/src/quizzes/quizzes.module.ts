import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { User } from '../entities/user.entity';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, UserProgress, ModuleEntity, User])],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports: [QuizzesService],
})
export class QuizzesModule {}
