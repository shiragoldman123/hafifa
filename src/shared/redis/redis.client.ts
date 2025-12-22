import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import config from 'src/config/env.config';

export const RedisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e.message}`);
    });

    redisInstance.on('connect', () => {
      console.log('Redis connected');
    });

    return redisInstance;
  },
  inject: [],
};
