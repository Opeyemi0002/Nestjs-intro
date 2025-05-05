import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './DTOs/createUserDto';
import { UsersService } from './users.service';
import { CreateManyUserDto } from './DTOs/createManyUser.dto';
import { CreateUserProvider } from './provider/create-user.provider';
//import { CreateParamDto } from './DTOs/createParamDto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly createUserProvider: CreateUserProvider,
  ) {}
  @Get('/:id')
  public getUsers(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findById(id);
  }

  @Post('/new')
  public async SignUp(@Body() body: CreateUserDto) {
    return await this.createUserProvider.createUser(body);
    //return await this.userService.createUser(body);
  }

  @Get('/profile/user')
  async find() {
    console.log('Controller hit');
    return await this.userService.getall();
  }

  @Get('/users/all')
  async findall(limit: number, id: number) {
    return;
  }

  @Post('/create/many')
  async createManyUsers(@Body() body: CreateManyUserDto) {
    return this.userService.createMany(body);
  }
}
