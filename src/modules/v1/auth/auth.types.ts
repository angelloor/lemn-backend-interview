export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthLoginData {
  email: string;
  password: string;
}
