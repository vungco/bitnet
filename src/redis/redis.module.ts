// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis'; // Import ioredis;
import { ConfigModule, ConfigService } from '@nestjs/config'; // Để đọc biến môi trường
import { RedisService } from './redis.service';

@Global() // Để có thể sử dụng RedisService ở bất kỳ đâu mà không cần import lại
@Module({
  imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
  providers: [
    {
      provide: 'REDIS_CLIENT', // Token để inject client Redis
      useFactory: (configService: ConfigService) => {
        // Lấy cấu hình Redis từ biến môi trường hoặc mặc định
        const redisHost =
          configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = configService.get<number>('REDIS_PORT') || 6379;
        const redisPassword = configService.get<string>('REDIS_PASSWORD') || '';

        const client = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          family: 0,
        });

        client.on('connect', () => console.log('Redis connected!'));
        client.on('error', (err) => console.error('Redis Client Error', err));

        return client;
      },
      inject: [ConfigService], // Inject ConfigService vào useFactory
    },
    RedisService,
  ],
  exports: [RedisService], // Export RedisService để các module khác có thể sử dụng
})
export class RedisModule {}
