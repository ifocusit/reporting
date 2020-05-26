import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingCommonModule } from '../../reporting-common.module';
import { CopyrightComponent } from './copyright.component';

@NgModule({
  declarations: [CopyrightComponent],
  imports: [CommonModule, ReportingCommonModule],
  exports: [CopyrightComponent]
})
export class CopyrightModule {}
