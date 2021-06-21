import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const allTasks = await this.taskRepository.getTasks(filterDto);
    if (!allTasks) throw new NotFoundException('No tasks found !');
    return allTasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found!`);
    }
    return found;
  }

  async deleteTaskById(id: number): Promise<Task> {
    const found = await this.getTaskById(id);
    return this.taskRepository.remove(found);
  }
  async updateTaskById(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
}
