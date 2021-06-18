import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // private tasks: Task[] = [
  //   {
  //     id: '1',
  //     title: 'First Task',
  //     description: 'This is my first task description.',
  //     status: TaskStatus.OPEN,
  //   },
  // ];
  async getAllTasks(): Promise<Task[]> {
    const allTasks = await this.taskRepository.find();
    if (!allTasks) throw new NotFoundException('No tasks found !');
    return allTasks;
  }
  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = null;
    if (status) {
      tasks = await this.taskRepository.find({ where: { status } });
    } else if (search) {
      tasks = await this.taskRepository.find({ title: Like(`%${search}%`) });
    }
    return tasks;
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
  // updateTaskById(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
}
