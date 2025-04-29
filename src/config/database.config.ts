import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: getValidPort(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DB_AUTOLOAD === 'true' ? true : false,
}));

const getValidPort = (port: string | undefined): number => {
  const parsedPort = parseInt(port || '5432', 10); // Default to '5432' if undefined
  return isNaN(parsedPort) ? 5432 : parsedPort; // Return 5432 if NaN
};
