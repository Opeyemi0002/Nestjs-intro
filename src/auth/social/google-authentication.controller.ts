import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from './Dtos/google-token.dto';
import { AuthType } from '../enum/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';

@Auth(AuthType.None)
@Controller('google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Post()
  async authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return await this.googleAuthenticationService.authentication(
      googleTokenDto,
    );
  }
}
