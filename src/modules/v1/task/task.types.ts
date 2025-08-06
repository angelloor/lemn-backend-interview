export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}

export interface CreateTaskData {
  title: string;
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  completed?: boolean;
}
