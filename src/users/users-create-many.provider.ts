import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './DTOs/createUserDto';
import { DataSource } from 'typeorm';
import { CreateManyUserDto } from './DTOs/createManyUser.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createMany(createManyUserDto: CreateManyUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let users: User[] = [];
    let isTransactionStarted = false;

    try {
      await queryRunner.connect();

      queryRunner.startTransaction();
      isTransactionStarted = true;

      for (const user of createManyUserDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        users.push(result);
      }

      await queryRunner.commitTransaction();

      return { message: 'Users created successfully', users };
    } catch (err) {
      if (isTransactionStarted) {
        try {
          await queryRunner.rollbackTransaction();
        } catch (rollbackError) {
          throw rollbackError; // Optional: log rollback failure (rare but possible)
        }
      }

      const isConnectionError = !isTransactionStarted;

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: isConnectionError
            ? 'Database connection failed while creating users'
            : 'Transaction failed while creating users',
          error: err?.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      try {
        await queryRunner.release();
      } catch (releaseError) {
        throw releaseError; // Optional: log release failure
      }
    }
  }
}
