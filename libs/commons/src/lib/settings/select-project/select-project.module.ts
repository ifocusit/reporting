import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../../reporting-commons.module';
import { SelectProjectComponent } from './select-project.component';

@NgModule({
  declarations: [SelectProjectComponent],
  imports: [CommonModule, ReportingCommonModule],
  exports: [SelectProjectComponent]
})
export class SelectProjectModule {}
