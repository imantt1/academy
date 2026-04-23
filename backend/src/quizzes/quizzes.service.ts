import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { User } from '../entities/user.entity';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepo: Repository<Quiz>,
    @InjectRepository(Question)
    private questionsRepo: Repository<Question>,
    @InjectRepository(UserProgress)
    private progressRepo: Repository<UserProgress>,
    @InjectRepository(ModuleEntity)
    private modulesRepo: Repository<ModuleEntity>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByModule(moduleId: number) {
    const quiz = await this.quizzesRepo.findOne({
      where: { moduleId },
      relations: ['questions'],
    });
    if (!quiz) throw new NotFoundException(`Quiz para módulo #${moduleId} no encontrado`);

    // Strip correct answers for students
    const safeQuestions = quiz.questions.map(({ correctAnswer, explanation, ...q }) => q);
    return { ...quiz, questions: safeQuestions };
  }

  async submit(moduleId: number, userId: string, dto: SubmitQuizDto) {
    // Check module exists and access
    const module = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!module) throw new NotFoundException(`Módulo #${moduleId} no encontrado`);

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (module.isPremium && !user?.hasPremiumAccess) {
      throw new ForbiddenException('Este módulo requiere acceso premium');
    }

    // Get quiz with answers
    const quiz = await this.quizzesRepo.findOne({
      where: { moduleId },
      relations: ['questions'],
    });
    if (!quiz) throw new NotFoundException(`Quiz para módulo #${moduleId} no encontrado`);

    // Grade
    let correct = 0;
    const results = dto.answers.map((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (!question) return { questionId: answer.questionId, correct: false, explanation: '' };
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correct++;
      return {
        questionId: answer.questionId,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= module.passingScore;

    // Save or update progress
    let progress = await this.progressRepo.findOne({ where: { userId, moduleId } });
    if (!progress) {
      progress = this.progressRepo.create({ userId, moduleId });
    }

    // Only update if improved
    if (!progress.score || score > progress.score) {
      progress.score = score;
    }
    if (passed && !progress.completed) {
      progress.completed = true;
    }
    await this.progressRepo.save(progress);

    return {
      score,
      passed,
      passingScore: module.passingScore,
      correct,
      total: quiz.questions.length,
      results,
    };
  }

  async getUserProgress(userId: string) {
    return this.progressRepo.find({ where: { userId } });
  }
}
