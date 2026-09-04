import { registerAs } from '@nestjs/config';

export default registerAs('axios', () => ({
  API_KEY: process.env.AXIOS_API_KEY,
}));
