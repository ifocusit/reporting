import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyReportComponent } from './daily-report.component';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DailyReportComponent],
  imports: [CommonModule, ReportingCommonModule, FormsModule],
  exports: [DailyReportComponent],
  entryComponents: [DailyReportComponent]
})
export class DailyReportModule {}
