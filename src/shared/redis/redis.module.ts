import { Module } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { RedisClientFactory } from './redis.client';

@Module({
  providers: [RedisRepository, RedisClientFactory],
  exports: [RedisRepository],
})
export class RedisModule {}
