// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from 'src/auth/auth.service';
// import { MailService } from 'src/mail/provider/mail.service';
// import { DataSource, ObjectLiteral, Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { CreateUserProvider } from './create-user.provider';
// import { User } from '../user.entity';
// import { HashingProvider } from 'src/auth/providers/hashing.provider';

// type MockRepository<T extends ObjectLiteral = any> = Partial<
//   Record<keyof Repository<T>, jest.Mock>
// >;
// const createMockRepository = <
//   T extends ObjectLiteral = any,
// >(): MockRepository<T> => ({
//   findOne: jest.fn(),
//   create: jest.fn(),
//   save: jest.fn(),
// });

// describe('UserService', () => {
//   let userProvider: CreateUserProvider;
//   let usersRepostiory:MockRepository<User>;

//   let user = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'JohnDoe.com',
//     password: 'password',
//   };

//   beforeEach(async () => {
//     let provider: TestingModule = await Test.createTestingModule({
//       providers: [
//         CreateUserProvider,
//         {
//           provide: HashingProvider,
//           useValue: { hashpassword: jest.fn(() => user.password) },
//         },
//         {
//           provide: DataSource,
//           useValue: {},
//         },
//         {
//           provide: getRepositoryToken(User),
//           useValue: createMockRepository<User>(),
//         },
//       ],
//     }).compile();

//     userProvider = provider.get<CreateUserProvider>(CreateUserProvider);
//     userProvider = provider.get(getRepositoryToken(User));
//   });

//   it('createUserProvider should be defined', () => {
//     expect(userProvider).toBeDefined();
//   });

// })
// describe("when a user doesn't exist in the database", ()=>{
//     let usersRepository:MockRepository<User>;

//     it("it should create a new user", ()=>{
//         usersRepository.findOne.mockReturnValue(null)
//     }),

// });
// describe("when a user doesn't exist in the database", ()=>{
//     it("it should create a new user", ()=>{

//     })
// });
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

// Create a mock repository type
type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

// Function to generate a mock repository
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateUserProvider', () => {
  let userProvider: CreateUserProvider;
  let usersRepository: MockRepository<User>;

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'JohnDoe@example.com',
    password: 'password',
    phoneNumber: '+2348161346989',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        {
          provide: HashingProvider,
          useValue: { hashpassword: jest.fn(() => 'hashed_password') },
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    userProvider = moduleRef.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = moduleRef.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userProvider).toBeDefined();
  });

  describe("when a user doesn't exist in the database", () => {
    it('should create a new user', async () => {
      usersRepository.findOne?.mockResolvedValue(null);
      usersRepository.create?.mockReturnValue(user);
      usersRepository.save?.mockResolvedValue({ ...user, id: 1 });

      const result = await userProvider.createUser(user);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...user,
        password: 'hashed_password',
      });
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual({ ...user, id: 1 });
    });
  });
});
