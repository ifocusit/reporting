import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { TimeModule } from '../time/time.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, CalendarRoutingModule, ReportingCommonModule, TimeModule, TranslateModule]
})
export class CalendarModule {}
