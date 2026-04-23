import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Module } from './module.entity';
import { Question } from './question.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Module, (module) => module.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @Column()
  moduleId: number;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];
}
