import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import axiosConfig from 'src/config/axios.config';
import type { ConfigType } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { CreateManyUserDto } from '../dtos/create-many-user.dto';
import { GoogleUserDto } from '../dtos/create-google-user.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @Inject(axiosConfig.KEY)
    private readonly axiosConfiguration: ConfigType<typeof axiosConfig>,
    private readonly datasource: DataSource,
  ) {}

  async getUser(id: number) {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });
      if (!existingUser) {
        throw new BadRequestException("user doesn't exist");
      }
      return existingUser;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw err;
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: data.email,
      });
      if (existingUser) {
        throw new ConflictException('email exists, kindly login in');
      }
      let newUser = this.userRepository.create(data);
      await this.userRepository.save(newUser);

      await this.mailService.sendWelcomeEmail(newUser);

      return 'registered successfully';
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async createGoogleUser(data: GoogleUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: data.email,
      });
      if (existingUser) {
        throw new ConflictException('email exists, kindly login in');
      }
      let newUser = this.userRepository.create(data);
      newUser = await this.userRepository.save(newUser);
      return newUser;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('Internal server error');
    }
  }
  async linkedGoogleAccount(user: User, googleId: string) {
    const findUser = await this.userRepository.findOneBy({ email: user.email });
    if (!findUser) {
      throw new UnauthorizedException('User authorization failed');
    }
    findUser.googleId = googleId;
    return await this.userRepository.save(findUser);
  }

  async createMany(createManyUserDto: CreateManyUserDto) {
    //create querryrunner instance
    //connect to datasource
    //    start trnsactions
    //commit transaction if successful
    // rollback if not successful
    let newUsers: User[] = [];

    const querryRunner = this.datasource.createQueryRunner();

    try {
      await querryRunner.connect();
      await querryRunner.startTransaction();
      for (let user of createManyUserDto.users) {
        let newUser = querryRunner.manager.create(User, user);
        let result = await querryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await querryRunner.commitTransaction();
    } catch (error) {
      if (querryRunner.isTransactionActive) {
        await querryRunner.rollbackTransaction();
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    } finally {
      await querryRunner.release();
    }
  }
  async findByEmail(email: string) {
    try {
      const findUser = await this.userRepository.findOneBy({ email });
      if (!findUser) {
        return false;
      }
      return findUser;
    } catch (err) {
      throw err;
    }
  }
  async findById(id: number) {
    try {
      const findUser = await this.userRepository.findOneBy({ id });
      if (!findUser) {
        return false;
      }
      return findUser;
    } catch (err) {
      throw err;
    }
  }
  async findByGoogleId(id: string) {
    try {
      const findUser = await this.userRepository.findOneBy({ googleId: id });
      if (!findUser) {
        return false;
      }
      return findUser;
    } catch (err) {
      throw err;
    }
  }
}
