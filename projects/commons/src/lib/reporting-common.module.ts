import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { DurationPipe } from './pipes/duration.pipe';
import { MomentPipe } from './pipes/moment.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { DebounceInputDirective } from './form/debounce-input.directive';

@NgModule({
  declarations: [DurationPipe, MomentPipe, DebounceInputDirective],
  providers: [DecimalPipe],
  imports: [CommonModule],
  exports: [DurationPipe, MomentPipe, DebounceInputDirective, MaterialModule, FlexLayoutModule, LayoutModule]
})
export class ReportingCommonModule {}
