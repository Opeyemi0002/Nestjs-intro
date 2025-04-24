import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './DTOs/createUserDto';
import { UsersService } from './users.service';
//import { CreateParamDto } from './DTOs/createParamDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('/:id')
  public getUsers(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findById(id);
  }

  @Post('/new')
  public async SignUp(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }
}
