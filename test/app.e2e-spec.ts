import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
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
  }, 50000);
  it('should reject registration when no data is provided', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register');
    expect(response.status).toBe(400);
  });
  it('should register a user with a valid details', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'Password!',
      });
    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      apiVersion: '0.01',
      data: 'registered successfully',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
