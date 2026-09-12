import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

const server = express();
let isAppInitialized = false;

const bootstrap = async () => {
  if (!isAppInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: false,
        transform: true,
        forbidUnknownValues: false,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    isAppInitialized = true;
  }
};

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
