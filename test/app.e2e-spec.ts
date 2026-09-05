import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { MailService } from 'src/mail/mail.service';
import request from 'supertest';

describe('app (e2e)', () => {
  let app: INestApplication;
  async function createApp() {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({ sendWelcomeEmail: jest.fn().mockResolvedValue(undefined) })
      .compile();

    const app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    return app.init();
  }

  beforeAll(async () => {
    app = await createApp();
  }, 30000);
  it('should reject registration when no data is provided', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register');
    expect(response.status).toBe(400);
  });
  it('should', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Tope',
        lastName: 'Gbadamosi',
        email: 'tope@example.com',
        password: 'Tope-password!',
      });

    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
