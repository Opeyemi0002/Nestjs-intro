import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('auth', () => {
  let authController: AuthController;

  let authService: {
    register: jest.Mock;
  };
  beforeEach(async () => {
    authService = {
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
      controllers: [AuthController],
    }).compile();
    authController = module.get<AuthController>(AuthController);
  });
  describe('user Registration', () => {
    it('should register  user', async () => {
      const body = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'Password',
      };
      authService.register.mockResolvedValue('registered successfully');
      await expect(authController.registerUser(body)).resolves.toBe(
        'registered successfully',
      );
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(body);
    });

    it('should throw a conflict error when email exist during registration', async () => {
      const body = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'Password',
      };
      authService.register.mockRejectedValue(
        new ConflictException('User exists, please sign in'),
      );
      await expect(authController.registerUser(body)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(body);
    });
    it('should throw internalServerError for unknown error', async () => {
      const body = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'Password',
      };
      authService.register.mockRejectedValue(
        new InternalServerErrorException(),
      );
      await expect(authController.registerUser(body)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(body);
    });
  });
});
describe('Auth', () => {
  let authController: AuthController;
  let authService: {
    signIn: jest.Mock;
  };
  beforeEach(async () => {
    authService = {
      signIn: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });
  describe('User SignIn', () => {
    it('User signin successfully', async () => {
      const body = {
        email: faker.internet.email(),
        password: 'Password!!!',
      };
      const passwordHash = 'passwordHash';
      const finduser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: body.email,
        password: passwordHash,
      };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      authService.signIn.mockResolvedValue({ ...finduser, ...tokens });
      await expect(authController.logInUser(body)).resolves.toEqual({
        ...finduser,
        ...tokens,
      });
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(body);
    });
    it('throw  ConflictException if it encountered an error', async () => {
      const body = {
        email: faker.internet.email(),
        password: 'Password!!!',
      };

      authService.signIn.mockRejectedValue(
        new ConflictException('Invalid details'),
      );
      await expect(authController.logInUser(body)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(body);
    });
    it('throw InternalServerErrorException if it encountered an error', async () => {
      const body = {
        email: faker.internet.email(),
        password: 'Password!!!',
      };
      authService.signIn.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );
      await expect(authController.logInUser(body)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(body);
    });
  });
});
