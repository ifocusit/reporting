import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportingCommonModule } from '@ifocusit/commons';
import { DailyReportComponent } from './daily-report.component';

@NgModule({
  declarations: [DailyReportComponent],
  imports: [CommonModule, ReportingCommonModule, FormsModule],
  exports: [DailyReportComponent],
  entryComponents: [DailyReportComponent]
})
export class DailyReportModule {}
