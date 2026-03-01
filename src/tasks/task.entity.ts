import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './enums/task-status.enum';
import { TaskPriority } from './enums/task-priority.enum';
import { User } from 'src/user/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
  })
  status: TaskStatus;

  @Column({
    type: 'text',
  })
  priority: TaskPriority;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  due_date?: Date;

  @ManyToOne(() => User, (user) => user.tasks, {
    eager: false, // puedes cambiar a true si quieres que siempre traiga el usuario
    nullable: false,
  })
  owner: User;
}
