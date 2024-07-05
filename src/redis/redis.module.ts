import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: new Redis({
        host: process.env.REDIS_HOST, // Redis server host
        port: parseInt(process.env.REDIS_PORT), // Redis server port
      }),
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
