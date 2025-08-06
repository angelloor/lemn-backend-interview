import { PrismaClient } from '@prisma/client';
import { CreateTaskData, Task, UpdateTaskData } from './task.types';

export class TaskService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Create a new task
  async createTask(taskData: CreateTaskData): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        title: taskData.title,
        userId: taskData.userId,
      },
    });

    return task;
  }

  // Get all tasks for a user
  async getUserTasks(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }

  // Get task by ID (verify it belongs to the user)
  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    return task;
  }

  // Update task
  async updateTask(taskId: string, userId: string, updateData: UpdateTaskData): Promise<Task> {
    // First verify the task belongs to the user
    const existingTask = await this.getTaskById(taskId, userId);
    if (!existingTask) {
      throw new Error('Task not found or does not belong to user');
    }

    const task = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateData,
    });

    return task;
  }

  // Delete task
  async deleteTask(taskId: string, userId: string): Promise<void> {
    // First verify the task belongs to the user
    const existingTask = await this.getTaskById(taskId, userId);
    if (!existingTask) {
      throw new Error('Task not found or does not belong to user');
    }

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
