import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerCustomGuard } from './guards/rate-limiting/throttler-custom.guard';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bullmq';
import { NotifierModule } from './notifier/notifier.module';
import { AudioModule } from './modules/audio/audio.module';
import { ImageModule } from './modules/image/image.module';
import { VideoModule } from './modules/video/video.module';
import { TextModule } from './modules/text/text.module';
import { InfluencerModule } from './modules/influencer/influencer.module';



@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 20
        },
      ],
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.QUEUE_REDIS_URL,
        port: 6379,
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' 
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'SYS:HH:MM:ss',
              },
            }
          : undefined,
      },
    }),
    NotifierModule,
    HttpModule,
    SharedModule,
    AuthModule,
    AudioModule,
    ImageModule,
    VideoModule,
    TextModule,
    InfluencerModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerCustomGuard,
    },
  ],
})
export class AppModule {}
