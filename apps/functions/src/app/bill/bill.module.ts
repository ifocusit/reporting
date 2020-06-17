import { Module } from '@nestjs/common';
import { SettingsModule } from './../settings/settings.module';
import { TimeModule } from './../time/time.module';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [TimeModule, SettingsModule],
  controllers: [BillController],
  providers: [BillService]
})
export class BillModule {}
