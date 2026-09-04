import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashService } from './providers/hash.service';
import { BcryptService } from './providers/bcrypt.service';
import { UserModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import googleAuthConfig from 'src/config/google-auth.config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './providers/tokenservice.service';
import { GoogleAuthService } from './providers/google-auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashService,
      useClass: BcryptService,
    },
    TokenService,
    GoogleAuthService,
  ],
  imports: [
    UserModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleAuthConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
