import { NgModule } from '@angular/core';
import { BillService } from '../bill/bill.service';
import { CalculationService } from './calculation.service';
import { ExportService } from './export.service';
import { TimesService } from './times.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [TimesService, ExportService, CalculationService, BillService],
  exports: []
})
export class TimesModule {}
