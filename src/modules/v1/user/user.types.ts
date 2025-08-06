export interface User {
  id: string;
  email: string;
  password: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
}
