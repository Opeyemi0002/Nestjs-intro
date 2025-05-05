import { registerAs } from '@nestjs/config';
import { getIntValidation } from 'src/common/parseInt.environmentalvariables';
export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: getIntValidation(process.env.DB_PORT, '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DB_AUTOLOAD === 'true' ? true : false,
}));
