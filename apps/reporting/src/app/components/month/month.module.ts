import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportingCommonModule, SelectProjectModule } from '@ifocusit/commons';
import { DailyReportModule } from './daily-report/daily-report.module';
import { MonthRoutingModule } from './month-routing.module';
import { MonthComponent } from './month.component';

@NgModule({
  declarations: [MonthComponent],
  imports: [CommonModule, MonthRoutingModule, ReportingCommonModule, DailyReportModule, SelectProjectModule]
})
export class MonthModule {}
