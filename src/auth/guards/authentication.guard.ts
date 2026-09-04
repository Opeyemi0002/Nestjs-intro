import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Authtype } from '../enum/enum.authtype';
import { AuthGuard } from './auth.guard';
import { Auth_Type_Key } from './constant.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = Authtype.Bearer;
  private readonly authTypeGuardMap: Record<
    Authtype,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly authGuard: AuthGuard,
  ) {
    this.authTypeGuardMap = {
      [Authtype.Bearer]: this.authGuard,
      [Authtype.None]: { canActivate: () => true },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(Auth_Type_Key, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    const error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(instance.canActivate(context));
      if (canActivate) {
        return true;
      }
      throw error;
    }
    throw new UnauthorizedException();
  }
}
