import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";

export class TaskService {
    private taskRepository: Repository<Task> = AppDataSource.getRepository(Task);
    private userRepository: Repository<User> = AppDataSource.getRepository(User);

    async createTask(title: string, description: string, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new Error("User not found");
        const task = this.taskRepository.create({ title, description, user });
        await this.taskRepository.save(task);
        return task;
    }

    async listTasks() {
        return this.taskRepository.find({ relations: { user: true } });
    }

    async getTaskById(id: string) {
        return this.taskRepository.findOne({ 
            where: { id },
            relations: { user: true }
        });

    }

    async updateTask(id: string, taskData: Partial<Task>) {
        await this.taskRepository.update(id, taskData);
        return this.getTaskById(id);
    }

    async deleteTask(id: string) {
        await this.taskRepository.delete(id);
    }

    async listTasksByUserId(userId: string) {
        return this.taskRepository.find({ where: { user: { id: userId } }, relations: { user: true } });
    }
}