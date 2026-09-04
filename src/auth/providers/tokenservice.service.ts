import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from 'src/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { RefreshTokenDto } from '../Dtos/refresh.token';
import { UserService } from 'src/users/providers/users.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          expiresIn: this.jwtConfiguration.expiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          expiresIn: this.jwtConfiguration.refreshTokenTtl,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async generateNewAccessToken(data: RefreshTokenDto) {
    try {
      // grab refresh token from Dto and verify refresh token
      const payload = await this.jwtService.verifyAsync(data.refreshToken, {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
      });

      // if valid, use the paylod to extract user and generate freshaccesstoken
      const userId = payload.sub;
      const userEmail = payload.email;

      const findUser = await this.userService.findById(userId);
      if (!findUser) {
        throw new UnauthorizedException();
      }
      const newAccessToken = await this.jwtService.signAsync(
        { sub: findUser.id, email: findUser.email },
        {
          secret: this.jwtConfiguration.secret,
          issuer: this.jwtConfiguration.issuer,
          audience: this.jwtConfiguration.audience,
          expiresIn: this.jwtConfiguration.expiresIn,
        },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
