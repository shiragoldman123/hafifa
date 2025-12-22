import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async pushToArray(key: string, value: string): Promise<void> {
    await this.redisClient.lpush(key, value);
  }

  async getArray(key: string): Promise<string[]> {
    return this.redisClient.lrange(key, 0, -1);
  }

  async getAllKeys(): Promise<string[]> {
    const keys = await this.redisClient.keys(`*`);
    return keys;
  }
}
