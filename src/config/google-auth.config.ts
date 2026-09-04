import { registerAs } from '@nestjs/config';

export default registerAs('google-auth', () => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_SECRET,
}));
