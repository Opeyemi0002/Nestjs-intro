import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // Default auth type is set to Bearer token
  private static readonly defaultAuthType = AuthType.Bearer;

  // The map will be initialized inside the constructor (not inline!)
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    // Now 'this.accessTokenGuard' is available, safe to initialize here
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = (await this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    const error = new UnauthorizedException();

    for (const instance of guards) {
      try {
        const result = await instance.canActivate(context);
        if (result) {
          return true;
        }
      } catch (err) {
        // Ignore and try next guard
      }
    }

    throw error;
  }
}
