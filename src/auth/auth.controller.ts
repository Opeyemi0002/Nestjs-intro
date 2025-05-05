import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './Dtos/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/checkauth')
  checkAuth(@Param('id', ParseIntPipe) id: number) {
    return this.authService.isAuth(id);
  }

  @Post('/signIn')
  signInUser(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
