import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectProjectComponent } from './select-project.component';
import { ReportingCommonModule } from '../../reporting-common.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [SelectProjectComponent],
  imports: [CommonModule, ReportingCommonModule],
  exports: [SelectProjectComponent]
})
export class SelectProjectModule {}
