import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 500 })
  description!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}