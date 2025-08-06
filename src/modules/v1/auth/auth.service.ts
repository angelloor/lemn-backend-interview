import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../../../libs/jwt';
import { AuthLoginData, AuthResponse, RegisterData } from './auth.types';

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Register a new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { email, password } = userData;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) { 
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      name: user.email, // Using email as name for simplicity
      email: user.email,
    }, parseInt(process.env.EXPIRATION_JWT as string));

    return {
      user,
      token,
    };
  }

  // Login user
  async login(loginData: AuthLoginData): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcryptjs.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      name: user.email, // Using email as name for simplicity
      email: user.email,
    }, parseInt(process.env.EXPIRATION_JWT as string));

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }
}
