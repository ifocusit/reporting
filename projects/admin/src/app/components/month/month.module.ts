import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthRoutingModule } from './month-routing.module';
import { MonthComponent } from './month.component';
import { DailyReportModule } from './daily-report/daily-report.module';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';

@NgModule({
  declarations: [MonthComponent],
  imports: [CommonModule, MonthRoutingModule, ReportingCommonModule, DailyReportModule, SelectProjectModule]
})
export class MonthModule {}
