import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserService } from 'src/users/providers/users.service';
import { HashService } from './hash.service';
import { SignInDto } from 'src/users/dtos/Signin.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { TokenService } from './tokenservice.service';
import { RefreshTokenDto } from '../Dtos/refresh.token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const findUser = await this.userService.findByEmail(createUserDto.email);
      if (findUser) {
        throw new ConflictException('User exists, please sign in');
      }

      const passwordHash = await this.hashService.hashPassword(
        createUserDto.password,
      );
      return await this.userService.createUser({
        ...createUserDto,
        password: passwordHash,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async signIn(data: SignInDto) {
    try {
      const findUser = await this.userService.findByEmail(data.email);

      if (!findUser) {
        throw new ConflictException('Invalid details');
      }
      if (!findUser.password) {
        throw new ConflictException('Invalid details');
      }

      const userPasswordValidation = await this.hashService.comparePassword(
        data.password,
        findUser.password,
      );

      if (!userPasswordValidation) {
        throw new ConflictException('Invalid details');
      }
      const tokens = await this.tokenService.getTokens(findUser);

      return { ...findUser, ...tokens };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
  async refreshAccessToken(refreshToken: RefreshTokenDto) {
    return await this.tokenService.generateNewAccessToken(refreshToken);
  }
}
