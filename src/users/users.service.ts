import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QueryRunnerAlreadyReleasedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTOs/createUserDto';
import { ConfigType } from '@nestjs/config';
import { DataSource } from 'typeorm';
import profileConfig from './config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    private readonly dataSource: DataSource,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Error logging in', {
          description: 'Email already exists',
        });
      }
      let newUser = this.userRepository.create(createUserDto);
      newUser = await this.userRepository.save(newUser);
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

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async getall() {
    console.log(this.profileConfiguration);
    return 'thanks';
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

  async createMany(createUserDto: CreateUserDto[]) {
    let users: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      for (let user of createUserDto) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);

        users.push(result);
      }
      await queryRunner.commitTransaction();
      return { message: 'Users created succesfully', users };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Transaction failed while creating users',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
