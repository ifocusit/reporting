import { NgModule } from '@angular/core';
import { SelectProjectComponent } from './select-project/select-project.component';
import { ReportingCommonModule } from '../reporting-common.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [SelectProjectComponent],
  imports: [ReportingCommonModule, BrowserModule],
  exports: [SelectProjectComponent]
})
export class SettingsModule {}
