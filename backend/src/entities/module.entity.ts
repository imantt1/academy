import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Quiz } from './quiz.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ default: 70 })
  passingScore: number;

  @Column({ nullable: true })
  sharedQuizGroup: number;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];

  @OneToMany(() => Quiz, (quiz) => quiz.module)
  quizzes: Quiz[];
}
