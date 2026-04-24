import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Module } from './module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  videoUrl: string;

  @ManyToOne(() => Module, (module) => module.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @Column()
  moduleId: number;
}
