import { Entity } from "typeorm";

@Entity('tasks')
export class Task {
  id!: number;
  title!: string;
  description!: string;
  completed!: boolean;
}