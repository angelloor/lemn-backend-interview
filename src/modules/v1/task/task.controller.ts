import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Request,
    Response,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from 'tsoa';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

@Route('tasks')
@Tags('Tasks')
export class TaskController extends Controller {
  private taskService: TaskService;

  constructor() {
    super();
    this.taskService = new TaskService();
  }

  /**
   * Get all tasks for the authenticated user
   */
  @Get()
  @Security('jwt')
  @SuccessResponse('200', 'Tasks retrieved successfully')
  public async getUserTasks(@Request() request: any): Promise<TaskResponseDto[]> {
    const userId = request.user.userId;
    return await this.taskService.getUserTasks(userId);
  }

  /**
   * Create a new task
   */
  @Post()
  @Security('jwt')
  @SuccessResponse('201', 'Task created successfully')
  @Response('400', 'Bad Request')
  public async createTask(
    @Body() taskData: CreateTaskDto,
    @Request() request: any
  ): Promise<TaskResponseDto> {
    try {
      const userId = request.user.userId;
      this.setStatus(201);
      return await this.taskService.createTask({
        title: taskData.title,
        userId,
      });
    } catch (error: any) {
      this.setStatus(400);
      throw new Error(error.message);
    }
  }

  /**
   * Update task by ID
   */
  @Put('{id}')
  @Security('jwt')
  @SuccessResponse('200', 'Task updated successfully')
  @Response('404', 'Task not found')
  @Response('400', 'Bad Request')
  public async updateTask(
    @Path() id: string,
    @Body() taskData: UpdateTaskDto,
    @Request() request: any
  ): Promise<TaskResponseDto> {
    try {
      const userId = request.user.userId;
      return await this.taskService.updateTask(id, userId, taskData);
    } catch (error: any) {
      this.setStatus(error.message.includes('not found') ? 404 : 400);
      throw new Error(error.message);
    }
  }

  /**
   * Delete task by ID
   */
  @Delete('{id}')
  @Security('jwt')
  @SuccessResponse('204', 'Task deleted successfully')
  @Response('404', 'Task not found')
  public async deleteTask(
    @Path() id: string,
    @Request() request: any
  ): Promise<void> {
    try {
      const userId = request.user.userId;
      await this.taskService.deleteTask(id, userId);
      this.setStatus(204);
    } catch (error: any) {
      this.setStatus(404);
      throw new Error('Task not found');
    }
  }
}
