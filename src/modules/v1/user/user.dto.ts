// Create User DTO
export interface CreateUserDto {
  email: string;
  password: string;
}

// Update User DTO
export interface UpdateUserDto {
  email?: string;
  password?: string;
}

// User Response DTO (without password)
export interface UserResponseDto {
  id: string;
  email: string;
}
