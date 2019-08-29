import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeComponent } from './time.component';
import { ReportingCommonModule } from 'projects/commons/src/public-api';

@NgModule({
  declarations: [TimeComponent],
  imports: [CommonModule, ReportingCommonModule],
  exports: [TimeComponent]
})
export class TimeModule {}
