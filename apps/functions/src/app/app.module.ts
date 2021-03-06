import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BillModule } from './bill/bill.module';
import { LoggerMiddleware } from './logger.middleware';
import { SettingsModule } from './settings/settings.module';
import { TimeModule } from './time/time.module';

export const API_PREFIX = '/api';

@Module({
  imports: [BillModule, TimeModule, SettingsModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
