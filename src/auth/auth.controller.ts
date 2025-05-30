import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './Dtos/signIn.dto';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';
import { RefreshTokenDto } from './Dtos/refreshtoken.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/checkauth')
  checkAuth(@Param('id', ParseIntPipe) id: string) {
    return this.authService.isAuth(id);
  }
  //@UseGuards(AccessTokenGuard)
  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  signInUser(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
  @Post('/refreshToken')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
  @Get('/google')
  redirectGoogle(@Res() res: Response) {}
}
