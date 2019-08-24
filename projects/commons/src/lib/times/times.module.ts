import { NgModule } from '@angular/core';
import { TimesService } from './times.service';
import { ExportService } from './export.service';
import { CalculationService } from './calculation.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [TimesService, ExportService, CalculationService],
  exports: []
})
export class TimesModule {}
