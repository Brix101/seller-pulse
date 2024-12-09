import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  ssl: process.env.REDIS_SSL === 'true',
  tls: process.env.REDIS_SSL === 'true',
  enableReadyCheck: false,
  // lazyConnect: true,
}));
