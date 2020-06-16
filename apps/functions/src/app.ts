import { AbstractHttpAdapter, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX, AppModule } from './app/app.module';

export const app = (httpAdapter?: AbstractHttpAdapter) =>
  NestFactory.create(AppModule, httpAdapter).then(nestApp => {
    nestApp.setGlobalPrefix(API_PREFIX);

    const swaggerOptions = new DocumentBuilder()
      .setTitle('Reporting Microservice')
      .setDescription('Reporting API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(nestApp, swaggerOptions);
    SwaggerModule.setup(API_PREFIX, nestApp, document);
    return nestApp;
  });
