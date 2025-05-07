import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './Dtos/signIn.dto';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/checkauth')
  checkAuth(@Param('id', ParseIntPipe) id: number) {
    return this.authService.isAuth(id);
  }
  //@UseGuards(AccessTokenGuard)
  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None, AuthType.Bearer)
  signInUser(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
