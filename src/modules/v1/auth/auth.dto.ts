// Register DTO
export interface RegisterDto {
  email: string;
  password: string;
}

// Login DTO
export interface AuthLoginDto {
  email: string;
  password: string;
}

// Auth Response DTO
export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
  };
  token: string;
}
