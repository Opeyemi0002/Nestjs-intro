import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import googleAuthConfig from 'src/config/google-auth.config';
import { GoogleLoginTokenDto } from '../Dtos/google-login-dto';
import { UserService } from 'src/users/providers/users.service';
import { TokenService } from './tokenservice.service';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oAuthClient: OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @Inject(googleAuthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleAuthConfig>,
  ) {}

  onModuleInit() {
    const clientSecret = this.googleConfiguration.googleSecret;
    const clientId = this.googleConfiguration.googleClientId;

    this.oAuthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: GoogleLoginTokenDto) {
    try {
      const loginTicket = await this.oAuthClient.verifyIdToken({
        idToken: token.googleLoginToken,
        audience: this.googleConfiguration.googleClientId,
      });
      const payLoad = loginTicket.getPayload();
      if (!payLoad) {
        throw new UnauthorizedException('Authentication fails');
      }
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payLoad;
      if (!email) {
        throw new UnauthorizedException();
      }
      const googleUser = await this.userService.findByGoogleId(googleId);
      if (googleUser) {
        const generateToken = await this.tokenService.getTokens(googleUser);
        return {
          user: {
            firstName,
            lastName,
            email,
          },
          ...generateToken,
        };
      }
      const checkExistingUser = await this.userService.findByEmail(email);
      if (checkExistingUser) {
        const updateUser = await this.userService.linkedGoogleAccount(
          checkExistingUser,
          googleId,
        );
        const generateToken = await this.tokenService.getTokens(updateUser);
        return {
          user: {
            firstName: updateUser.firstName,
            lastName: updateUser.lastName,
            email,
          },
          ...generateToken,
        };
      }

      const newGoogleUser = await this.userService.createGoogleUser({
        googleId,
        firstName,
        lastName,
        email,
      });
      const generateToken = await this.tokenService.getTokens(newGoogleUser);

      return {
        user: {
          firstName: newGoogleUser.firstName,
          lastName: newGoogleUser.lastName,
          email,
        },
        ...generateToken,
      };
    } catch (err) {
      throw err;
    }
  }
}
