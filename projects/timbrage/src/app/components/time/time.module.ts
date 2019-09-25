import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { TimeComponent } from './time.component';

@NgModule({
  declarations: [TimeComponent],
  imports: [CommonModule, ReportingCommonModule, TranslateModule],
  exports: [TimeComponent]
})
export class TimeModule {}
