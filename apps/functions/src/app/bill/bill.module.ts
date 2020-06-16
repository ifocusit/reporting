import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';

@Module({
  imports: [],
  controllers: [BillController],
  providers: []
})
export class BillModule {}
