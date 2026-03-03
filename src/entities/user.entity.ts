import { Entity } from "typeorm";

@Entity('users')



export class User {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
}