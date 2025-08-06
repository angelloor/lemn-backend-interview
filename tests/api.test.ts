import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication', () => {
    it('should return error for missing auth endpoints without validation', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      // Should return some kind of error (400, 422, or 500)
      expect([400, 422, 500]).toContain(response.status);
    });
  });
});
