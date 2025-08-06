import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { CreateUserData, UpdateUserData, UserWithoutPassword } from './user.types';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Create a new user
  async createUser(userData: CreateUserData): Promise<UserWithoutPassword> {
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

    return user;
  }

  // Get all users
  async getAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    return users;
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<UserWithoutPassword> {
    const updateData: any = {};

    if (userData.email) {
      updateData.email = userData.email;
    }

    if (userData.password) {
      updateData.password = await bcryptjs.hash(userData.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
