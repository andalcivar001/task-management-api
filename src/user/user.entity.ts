import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Task } from 'src/tasks/task.entity';
//hace referencia a una tabla de la base de datos
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  usuario: string;

  @Column()
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];

  @BeforeInsert()
  async hashPassowrd() {
    this.password = await hash(this.password, Number(process.env.HASH_SALT));
  }
}
