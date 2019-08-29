import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { TimeModule } from '../time/time.module';

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, CalendarRoutingModule, ReportingCommonModule, TimeModule]
})
export class CalendarModule {}
