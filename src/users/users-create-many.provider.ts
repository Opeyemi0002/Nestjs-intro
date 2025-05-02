import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './DTOs/createUserDto';
import { DataSource } from 'typeorm';
import { CreateManyUserDto } from './DTOs/createManyUser.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createMany(createManyUserDto: CreateManyUserDto) {
    let users: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      for (let user of createManyUserDto.users) {
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
