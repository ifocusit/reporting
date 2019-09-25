import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { TimeModule } from '../time/time.module';
import { TimbrageRoutingModule } from './timbrage-routing.module';
import { TimbrageComponent } from './timbrage.component';

@NgModule({
  declarations: [TimbrageComponent],
  imports: [CommonModule, TimbrageRoutingModule, ReportingCommonModule, TimeModule, TranslateModule]
})
export class TimbrageModule {}
