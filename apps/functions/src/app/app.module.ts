import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

export const API_PREFIX = '/reporting/api';

@Module({
  imports: [],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
