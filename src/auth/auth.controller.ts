import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SignInDto } from 'src/users/dtos/Signin.dto';
import { Authtype } from './enum/enum.authtype';
import { Auth } from './decorator/auth.decorator';
import { RefreshTokenDto } from './Dtos/refresh.token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Auth(Authtype.None)
  @Post('/register')
  async registerUser(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }
  @Auth(Authtype.None)
  @Post('/login')
  async logInUser(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }
  @Post('refresh')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
