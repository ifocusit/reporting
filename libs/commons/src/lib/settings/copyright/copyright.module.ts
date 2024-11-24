import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../../reporting-commons.module';
import { CopyrightComponent } from './copyright.component';

@NgModule({
  declarations: [CopyrightComponent],
  imports: [CommonModule, ReportingCommonModule],
  exports: [CopyrightComponent]
})
export class CopyrightModule {}
