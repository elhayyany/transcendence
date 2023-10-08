import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const startTime = process.hrtime();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://client', 'http://localhost:3000', 'http://localhost:8000', 'http://nginx:80'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Transcedence API')
    .setDescription('everything you need to know about the APIs')
    .setVersion('1.0')
    .addTag('transcedence')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  const endTime = process.hrtime(); // Record the end time

  const elapsedSeconds = endTime[0] - startTime[0];
  const elapsedMilliseconds = (endTime[1] - startTime[1]) / 1e6;
  console.log(`NestJS application started in ${elapsedSeconds}s ${elapsedMilliseconds}ms`);

}
bootstrap();
