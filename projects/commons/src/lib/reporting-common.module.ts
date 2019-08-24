import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { DurationPipe } from './pipes/duration.pipe';
import { MomentPipe } from './pipes/moment.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [DurationPipe, MomentPipe],
  imports: [CommonModule],
  exports: [DurationPipe, MomentPipe, MaterialModule, FlexLayoutModule, LayoutModule]
})
export class ReportingCommonModule {}
