import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClient, OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GoogleTokenDto } from './Dtos/google-token.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtconfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtconfiguration.googleClientId;
    const clientSecret = this.jwtconfiguration.googleClientSecret;

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authentication(googleTokenDto: GoogleTokenDto) {
    //verify the google token sent bu User
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      //extract the payload from Google JWT

      const payload = loginTicket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid google token');
      }

      const user = await this.usersService.findOneByGoogleId(payload.sub);

      if (user) {
        return this.authService.generateRefreshToken(user);
      }
      const newUser = await this.usersService.googleUser({
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        googleId: payload.sub,
      });
      return this.authService.generateRefreshToken(newUser);
    } catch (err) {
      throw err;
    }

    //if googleId exist, generatetoken
    //if not, create  new user and then generate tokens
    //throw unauthorized error
  }
}
