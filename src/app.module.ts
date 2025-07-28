import {  Module } from '@nestjs/common';
import { ApiModule } from './api';
import { DatabaseModule } from './database';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ApiModule,DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // cho phép dùng process.env ở mọi nơi
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
