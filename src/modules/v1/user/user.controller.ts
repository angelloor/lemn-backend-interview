import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Response,
    Route,
    SuccessResponse,
    Tags,
} from 'tsoa';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { UserService } from './user.service';

@Route('users')
@Tags('Users')
export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * Create a new user
   */
  @Post()
  @SuccessResponse('201', 'User created successfully')
  @Response('400', 'Bad Request')
  @Response('409', 'User already exists')
  public async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    try {
      this.setStatus(201);
      return await this.userService.createUser(userData);
    } catch (error: any) {
      this.setStatus(error.message.includes('already exists') ? 409 : 400);
      throw new Error(error.message);
    }
  }

  /**
   * Get all users
   */
  @Get()
  @SuccessResponse('200', 'Users retrieved successfully')
  public async getAllUsers(): Promise<UserResponseDto[]> {
    return await this.userService.getAllUsers();
  }

  /**
   * Get user by ID
   */
  @Get('{id}')
  @SuccessResponse('200', 'User retrieved successfully')
  @Response('404', 'User not found')
  public async getUserById(@Path() id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    
    if (!user) {
      this.setStatus(404);
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user by ID
   */
  @Put('{id}')
  @SuccessResponse('200', 'User updated successfully')
  @Response('404', 'User not found')
  @Response('400', 'Bad Request')
  public async updateUser(
    @Path() id: string,
    @Body() userData: UpdateUserDto
  ): Promise<UserResponseDto> {
    try {
      return await this.userService.updateUser(id, userData);
    } catch (error: any) {
      this.setStatus(error.message.includes('not found') ? 404 : 400);
      throw new Error(error.message);
    }
  }

  /**
   * Delete user by ID
   */
  @Delete('{id}')
  @SuccessResponse('204', 'User deleted successfully')
  @Response('404', 'User not found')
  public async deleteUser(@Path() id: string): Promise<void> {
    try {
      await this.userService.deleteUser(id);
      this.setStatus(204);
    } catch (error: any) {
      this.setStatus(404);
      throw new Error('User not found');
    }
  }
}
