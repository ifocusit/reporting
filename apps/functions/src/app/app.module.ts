import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BillModule } from './bill/bill.module';

export const API_PREFIX = '/api';

@Module({
  imports: [BillModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
