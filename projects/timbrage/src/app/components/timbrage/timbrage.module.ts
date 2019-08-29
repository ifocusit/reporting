import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimbrageRoutingModule } from './timbrage-routing.module';
import { TimbrageComponent } from './timbrage.component';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { TimeModule } from '../time/time.module';

@NgModule({
  declarations: [TimbrageComponent],
  imports: [CommonModule, TimbrageRoutingModule, ReportingCommonModule, TimeModule]
})
export class TimbrageModule {}
