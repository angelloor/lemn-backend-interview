import { Controller, Get, Route, SuccessResponse, Tags } from 'tsoa';

@Route('health')
@Tags('Health')
export class HealthController extends Controller {
  /**
   * Health check endpoint
   */
  @Get()
  @SuccessResponse('200', 'Service is healthy')
  public getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
