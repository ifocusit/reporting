import { Module } from '@nestjs/common';
import { ImportReportService } from './import/import-report.service';
import { TimeController } from './time.controller';
import { TimeService } from './time.service';

@Module({
  imports: [],
  controllers: [TimeController],
  providers: [TimeService, ImportReportService],
  exports: [TimeService]
})
export class TimeModule {}
