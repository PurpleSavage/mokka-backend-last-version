import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookie from '@fastify/cookie'; 
import { Logger } from 'nestjs-pino'

async function bootstrap() {
  const whitelist = [
    'http://localhost:5173',
    'http://localhost:3000'
  ]

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  )
  app.useLogger(app.get(Logger))
  
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });


  await app.register(cookie, {
    secret: 'mokka-secret',
  });


  await app.listen(process.env.PORT ?? 4000,'0.0.0.0')
}
bootstrap().catch((err) => {
  console.error('Error starting the app', err);
  process.exit(1);
});
