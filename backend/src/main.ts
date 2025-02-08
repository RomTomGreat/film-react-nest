import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha');
  app.enableCors({ origin: true, credentials: true });
  app.useLogger(new TskvLogger());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
