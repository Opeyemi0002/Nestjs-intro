import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { FindOneByGoogleIdProvider } from './provider/find-one-by-google-id.provider';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/provider/mail.service';
import { DataSource, ObjectLiteral } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateManyUserDto } from './DTOs/createManyUser.dto';

describe('UserService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    let service: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersCreateManyProvider,
          useValue: {},
        },
        {
          provide: FindOneByGoogleIdProvider,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: MailService,
          useValue: {sendUserWelcome:jest.fn(()=> Promise.resolve())},
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    userService = service.get<UsersService>(UsersService);
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });
});
