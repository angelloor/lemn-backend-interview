import {
    Body,
    Controller,
    Post,
    Response,
    Route,
    SuccessResponse,
    Tags,
} from 'tsoa';
import { AuthLoginDto, AuthResponseDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  @Post('register')
  @SuccessResponse('201', 'User registered successfully')
  @Response('400', 'Bad Request')
  @Response('409', 'User already exists')
  public async register(@Body() userData: RegisterDto): Promise<AuthResponseDto> {
    this.setStatus(201);
    return await this.authService.register(userData);
  }

  /**
   * Login user
   */
  @Post('login')
  @SuccessResponse('200', 'Login successful')
  @Response('401', 'Invalid credentials')
  public async login(@Body() loginData: AuthLoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginData);
  }
}
