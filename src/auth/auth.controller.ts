import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/checkauth')
  checkAuth(@Param('id', ParseIntPipe) id: number) {
    return this.authService.isAuth(id);
  }
}
