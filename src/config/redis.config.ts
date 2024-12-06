import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  user: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  sslEnabled: process.env.REDIS_SSL_ENABLED === 'true',
}));
