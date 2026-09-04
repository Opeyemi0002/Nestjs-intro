import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

// Learning example only: the .example.ts name keeps this out of normal Jest runs.
describe('AuthController: learning example', () => {
  let controller: AuthController;
  let moduleRef: TestingModule;

  // These are the controller's helpers, not the real AuthService implementation.
  let authServiceMock: {
    register: jest.Mock;
    signIn: jest.Mock;
    refreshAccessToken: jest.Mock;
  };

  beforeEach(async () => {
    // A fresh set of mocks gives every test a clean starting point.
    authServiceMock = {
      register: jest.fn(),
      signIn: jest.fn(),
      refreshAccessToken: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        // Whenever AuthController asks for AuthService, supply our mock object.
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('registerUser', () => {
    it('passes the body to the service once and returns its result', async () => {
      // ARRANGE: choose the input and the service's pretend answer.
      const body: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const serviceResult = 'registered successfully';
      authServiceMock.register.mockResolvedValue(serviceResult);

      // ACT: call the REAL controller method, not the mock directly.
      const result = await controller.registerUser(body);

      // ASSERT: check the hand-off and what the caller receives.
      expect(authServiceMock.register).toHaveBeenCalledTimes(1);
      expect(authServiceMock.register).toHaveBeenCalledWith(body);
      expect(result).toBe(serviceResult);
    });

    it('passes a service error back to the caller without replacing it', async () => {
      // ARRANGE: the service will reject instead of returning a result.
      const body: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const error = new ConflictException('User exists, please sign in');
      authServiceMock.register.mockRejectedValue(error);

      // ACT + ASSERT: wait for the rejection and check the same error object.
      await expect(controller.registerUser(body)).rejects.toBe(error);

      expect(authServiceMock.register).toHaveBeenCalledTimes(1);
      expect(authServiceMock.register).toHaveBeenCalledWith(body);
    });
  });
});
