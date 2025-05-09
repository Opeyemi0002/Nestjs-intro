import { registerAs } from '@nestjs/config';
import { getIntValidation } from 'src/common/parseInt.environmentalvariables';

export default registerAs('jwt', () => ({
  key: process.env.JWT_SECRET_KEY,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  expiry: getIntValidation(process.env.JWT_EXPIRY, '3600'),
  refreshTokenExpiry: getIntValidation(
    process.env.JWT__REFRESH_TOKEN_EXPIRY,
    '46000',
  ),
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
}));
