import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './Dtos/signIn.dto';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/checkauth')
  checkAuth(@Param('id', ParseIntPipe) id: number) {
    return this.authService.isAuth(id);
  }
  //@UseGuards(AccessTokenGuard)
  @Post('/signIn')
  signInUser(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
