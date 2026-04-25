import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookie from '@fastify/cookie'; 
import { Logger } from 'nestjs-pino'
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger' 

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

  const config = new DocumentBuilder()
    .setTitle('Mokka AI API')
    .setDescription('The Mokka API description')
    .setVersion('1.0')
    .addTag('mokka')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // --- 2. SEGUNDO: Pasas el documento ya creado a Scalar ---
  app.use(
    '/docs',
    apiReference({
      theme: 'deepSpace',
      withFastify: true,
      content: document, 
    }),
  );


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
