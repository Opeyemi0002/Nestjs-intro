import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  findById(id: string) {
    try {
      return {
        firstName: 'Opeyemi',
        lastName: 'Seun',
        email: 'opsy5916@gmail.com',
        auth: this.authService.isAuth(id),
      };
    } catch (err) {}
  }
}
