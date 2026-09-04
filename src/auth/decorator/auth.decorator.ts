import { SetMetadata } from '@nestjs/common';
import { Auth_Type_Key } from '../guards/constant.guard';
import { Authtype } from '../enum/enum.authtype';

export const Auth = (...authtypes: Authtype[]) =>
  SetMetadata(Auth_Type_Key, authtypes);
