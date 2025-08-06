// Create Task DTO
export interface CreateTaskDto {
  title: string;
}

// Update Task DTO
export interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}

// Task Response DTO
export interface TaskResponseDto {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}
