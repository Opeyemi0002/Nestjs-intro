import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './Dtos/signIn.dto';
import { HashingProvider } from './providers/hashing.provider';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from './interfaces/activeuserdata.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly hashProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  isAuth(id: number) {
    const user = this.userService.findById(id);
  }

  async signIn(data: SignInDto) {
    try {
      const { email, password } = data;
      const user = await this.userService.findUser(email);

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid credentials',
            error: 'BAD_REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const checkPassword = this.hashProvider.comparePassword(
        password,
        user.password,
      );

      if (!checkPassword) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid credentials',
            error: 'BAD_REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        } as ActiveUserData,
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          expiresIn: this.jwtConfiguration.expiry,
        },
      );
      return {
        status: 'Success',
        data: user,
        token: accessToken,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);

      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error loggin in',
        error: 'Internal Server Error',
      });
    }
  }
}
