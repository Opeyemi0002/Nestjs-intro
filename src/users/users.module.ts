import { Module } from '@nestjs/common';
import { UserService } from './providers/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import axiosConfig from 'src/config/axios.config';

@Module({
  providers: [UserService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(axiosConfig),
  ],
  exports: [UserService],
})
export class UserModule {}
