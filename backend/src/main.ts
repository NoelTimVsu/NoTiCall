import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as path from 'path';

const allowedOrigins =
  process.env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:3000']
    : ['https://budget-app-5oyx.onrender.com'];

const corsOptionsDelegate = function (req, callback) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const origin = req.header('Origin') || req.header('origin');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!origin || allowedOrigins.indexOf(origin) !== -1) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callback(null, {
      origin: true,
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callback(new Error('Not Allowed by CORS'), {
      origin: false,
    });
  }
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(corsOptionsDelegate);
  // validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  if (process.env.NODE_ENV === 'production' || true) {
    app.useStaticAssets(path.join(__dirname, '../../frontend/dist'));
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
