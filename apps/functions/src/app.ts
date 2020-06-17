import { AbstractHttpAdapter, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX, AppModule } from './app/app.module';
import { AuthGuard } from './app/auth/auth.guard';

export const app = (httpAdapter?: AbstractHttpAdapter) =>
  NestFactory.create(AppModule, httpAdapter).then(nestApp => {
    nestApp.setGlobalPrefix(API_PREFIX);
    nestApp.useGlobalGuards(new AuthGuard());

    const swaggerOptions = new DocumentBuilder()
      .setTitle('Reporting Microservice')
      .setDescription('Reporting API')
      .setVersion('1.0')
      .addSecurity('reporting_auth', { type: 'apiKey', name: 'token', in: 'header', description: 'Access token' })
      .addSecurityRequirements('reporting_auth')
      .build();
    const document = SwaggerModule.createDocument(nestApp, swaggerOptions);
    SwaggerModule.setup(API_PREFIX, nestApp, document);
    return nestApp;
  });
