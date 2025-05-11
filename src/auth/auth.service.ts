import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './Dtos/signIn.dto';
import { HashingProvider } from './providers/hashing.provider';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from './interfaces/activeuserdata.interface';
import { User } from 'src/users/user.entity';
import { RefreshTokenDto } from './Dtos/refreshtoken.dto';

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

  isAuth(id: string) {
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
      // const accessToken = await this.jwtService.signAsync(
      //   {
      //     sub: user.id,
      //     email: user.email,
      //   } as ActiveUserData,
      //   {
      //     audience: this.jwtConfiguration.audience,
      //     issuer: this.jwtConfiguration.issuer,
      //     secret: this.jwtConfiguration.key,
      //     expiresIn: this.jwtConfiguration.expiry,
      //   },
      // );
      const refreshToken = await this.generateRefreshToken(user);
      return {
        status: 'Success',
        data: user,
        token: refreshToken,
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

  async signInToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.key,
        expiresIn: this.jwtConfiguration.refreshTokenExpiry,
      },
    );
  }

  async generateRefreshToken(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signInToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.expiry,
        { email: user.email },
      ),

      this.signInToken(user.id, this.jwtConfiguration.refreshTokenExpiry),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.key,
        },
      );
      const user = await this.userService.findById(sub);
      if (!user) {
        throw new UnauthorizedException('User not authorized');
      }

      return await this.generateRefreshToken(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'UNAUTHORIZED',
            error: err.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL_SERVER_ERROR',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
