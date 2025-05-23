import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QueryRunnerAlreadyReleasedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTOs/createUserDto';
import { ConfigType } from '@nestjs/config';
import { DataSource } from 'typeorm';
import profileConfig from './config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { FindOneByGoogleIdProvider } from './provider/find-one-by-google-id.provider';
import { CreateManyUserDto } from './DTOs/createManyUser.dto';
import { GoogleUser } from 'src/auth/social/interfaces/google-user.interface';
import { MailService } from 'src/mail/provider/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
    private readonly mailService: MailService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new BadRequestException('Error logging in', {
          description: 'Email already exists',
        });
      }
      let newUser = this.userRepository.create(createUserDto);
      newUser = await this.userRepository.save(newUser);
      try {
        await this.mailService.sendUserWelcome(newUser);
      } catch (err) {
        throw err;
      }

      return {
        response: 'Success',
        user: newUser,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      console.error('Unexpected error in createUser:', err);
      throw new InternalServerErrorException('an unexpected error occured');
    }
  }

  async findById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findall(limit: number, page: number) {
    try {
      let users = await this.userRepository.find({
        relations: {
          posts: true,
        },
      });
      if (!users) {
        throw new HttpException(
          {
            statuscode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            error: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return { users };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new HttpException(
        {
          statuscode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occured',
          error: 'NOT_FOUND',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createMany(createManyUserDto: CreateManyUserDto) {
    return await this.usersCreateManyProvider.createMany(createManyUserDto);
  }
  async findUser(email: string) {
    try {
      let user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new BadRequestException();
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findByGoogleId(googleId);
  }
  async googleUser(googleUser: GoogleUser) {
    try {
      const user = this.userRepository.create(googleUser);
      return await this.userRepository.save(googleUser);
    } catch (err) {
      throw new ConflictException(err, {
        description: 'Could not create a new user',
      });
    }
  }
}
