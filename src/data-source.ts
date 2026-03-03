import 'reflect-metadata';
import {User} from './entities/user.entity';
import {Task} from './entities/task.entity';
import * as dotenv from "dotenv";
import {DataSource} from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DBHOST || 'localhost',
  port: parseInt(process.env.DBPORT || "3306"),
  username: process.env.DBUSER || 'root',
  password: process.env.DBPASS || '',
  database: process.env.DBNAME || 'typeorm_demo',
  synchronize: true,
  logging: false,
  entities: [User, Task],
});
