import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '@ifocusit/commons';
import { TranslateModule } from '@ngx-translate/core';
import { TimeComponent } from './time.component';

@NgModule({
  declarations: [TimeComponent],
  imports: [CommonModule, ReportingCommonModule, TranslateModule],
  exports: [TimeComponent]
})
export class TimeModule {}
