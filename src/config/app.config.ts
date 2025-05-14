import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMPTP_USERNAME,
  smtpPassword: process.env.SMPTP_PASSWORD,
}));
