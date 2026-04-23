import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  moduleId: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  score: number;

  @Column({ default: false })
  certificateIssued: boolean;

  @CreateDateColumn()
  completedAt: Date;
}
