import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/providers/users.service';
import { TokenService } from './tokenservice.service';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;

  let userService: {
    createUser: jest.Mock;
    findByEmail: jest.Mock;
  };

  let hashService: {
    hashPassword: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
    };

    const tokenService = {};
    hashService = {
      hashPassword: jest.fn(),
    };
    const jwtConfiguration = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: TokenService, useValue: tokenService },
        { provide: HashService, useValue: hashService },
        { provide: JwtService, useValue: {} },
        { provide: jwtConfig.KEY, useValue: jwtConfiguration },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw an error if email exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        email: 'johndoe@gmail.com',
      };
      const findUser = {
        id: 1,
        email: 'johndoe@gmail.com',
      };
      userService.findByEmail.mockResolvedValue(findUser);
      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(hashService.hashPassword).not.toHaveBeenCalled();
      expect(userService.createUser).not.toHaveBeenCalled();
    });
    it('register a user', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        email: 'johndoe@gmail.com',
      };
      const hashedPassword = 'hashed-password';
      const createdUser = {
        firstName: 'John',
        lastName: 'Doe',
        password: hashedPassword,
        email: 'johndoe@gmail.com',
      };
      userService.findByEmail.mockResolvedValue(null);

      hashService.hashPassword.mockResolvedValue(hashedPassword);
      userService.createUser.mockResolvedValue(createdUser);
      await expect(service.register(createUserDto)).resolves.toEqual(
        createdUser,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(hashService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      return expect(userService.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });
    it('should convert unexpected errors into InternalServerErrorException', async () => {
      const createUserDto = {
        email: 'john@example.com',
        password: 'Password123!',
        firstName: 'John',
      } as any;
      const error = new Error('Database error');
      userService.findByEmail.mockRejectedValue(error);
      await expect(service.register(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe;
});

describe('Auth Service', () => {
  let service: AuthService;

  let userService: {
    findByEmail: jest.Mock;
  };

  let hashService: {
    comparePassword: jest.Mock;
  };
  let tokenService: {
    getTokens: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
    };
    tokenService = {
      getTokens: jest.fn(),
    };
    hashService = {
      comparePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: TokenService, useValue: tokenService },
        { provide: HashService, useValue: hashService },
        { provide: JwtService, useValue: {} },
        { provide: jwtConfig.KEY, useValue: {} },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  describe('SignIn', () => {
    it('throw conflictException if email is not in database', async () => {
      const data = {
        email: 'johndoe@gmail.com',
        password: 'password',
      };
      userService.findByEmail.mockResolvedValue(null);
      await expect(service.signIn(data)).rejects.toThrow(ConflictException);
      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
      expect(hashService.comparePassword).not.toHaveBeenCalled();
      expect(tokenService.getTokens).not.toHaveBeenCalled();
    });
    it('throw conflictException if user is found but user password is missing', async () => {
      const data = {
        email: 'johndoe@gmail.com',
        password: 'password',
      };

      const googleUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        googleId: 'google-Id',
        email: 'johndoe@gmail.com',
        password: null,
      };
      userService.findByEmail.mockResolvedValue(googleUser);
      await expect(service.signIn(data)).rejects.toThrow(ConflictException);
      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
      expect(hashService.comparePassword).not.toHaveBeenCalled();
      expect(tokenService.getTokens).not.toHaveBeenCalled();
    });
    it('throw conflictException if there is password conflict', async () => {
      const data = {
        email: 'johndoe@gmail.com',
        password: 'password',
      };
      const passwordHash = 'password-hash';
      const findUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: passwordHash,
      };
      userService.findByEmail.mockResolvedValue(findUser);
      hashService.comparePassword.mockResolvedValue(false);
      await expect(service.signIn(data)).rejects.toThrow(ConflictException);

      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);

      expect(hashService.comparePassword).toHaveBeenCalledWith(
        data.password,
        findUser.password,
      );
      expect(tokenService.getTokens).not.toHaveBeenCalled();
    });

    it('return user details with tokens', async () => {
      const data = {
        email: 'johndoe@gmail.com',
        password: 'password',
      };
      const passwordHash = 'password-hash';
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const findUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: passwordHash,
      };
      userService.findByEmail.mockResolvedValue(findUser);
      hashService.comparePassword.mockResolvedValue(true);
      tokenService.getTokens.mockResolvedValue(tokens);
      await expect(service.signIn(data)).resolves.toEqual({
        ...findUser,
        ...tokens,
      });
      expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
      expect(hashService.comparePassword).toHaveBeenCalledWith(
        data.password,
        findUser.password,
      );
      expect(tokenService.getTokens).toHaveBeenCalledWith(findUser);
    });
    describe('unexpected errors', () => {
      it('should convert a user lookup error into InternalServerErrorException', async () => {
        const data = {
          email: 'johndoe@gmail.com',
          password: 'password',
        };

        userService.findByEmail.mockRejectedValue(new Error('Database error'));

        await expect(service.signIn(data)).rejects.toThrow(
          InternalServerErrorException,
        );
        expect(hashService.comparePassword).not.toHaveBeenCalled();
        expect(tokenService.getTokens).not.toHaveBeenCalled();
      });

      it('should convert a password comparison error into InternalServerErrorException', async () => {
        const data = {
          email: 'johndoe@gmail.com',
          password: 'password',
        };
        const findUser = {
          id: 1,
          email: 'johndoe@gmail.com',
          password: 'password-hash',
        };

        userService.findByEmail.mockResolvedValue(findUser);
        hashService.comparePassword.mockRejectedValue(
          new Error('Password comparison error'),
        );

        await expect(service.signIn(data)).rejects.toThrow(
          InternalServerErrorException,
        );
        expect(hashService.comparePassword).toHaveBeenCalledWith(
          data.password,
          findUser.password,
        );
        expect(tokenService.getTokens).not.toHaveBeenCalled();
      });

      it('should convert a token generation error into InternalServerErrorException', async () => {
        const data = {
          email: 'johndoe@gmail.com',
          password: 'password',
        };
        const findUser = {
          id: 1,
          email: 'johndoe@gmail.com',
          password: 'password-hash',
        };

        userService.findByEmail.mockResolvedValue(findUser);
        hashService.comparePassword.mockResolvedValue(true);
        tokenService.getTokens.mockRejectedValue(
          new Error('Token generation error'),
        );

        await expect(service.signIn(data)).rejects.toThrow(
          InternalServerErrorException,
        );
        expect(tokenService.getTokens).toHaveBeenCalledWith(findUser);
      });
    });
  });
});
