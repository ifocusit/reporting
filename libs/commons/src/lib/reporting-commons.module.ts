import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule, DecimalPipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { InitializationService } from './app';
import { DebounceInputDirective } from './form/debounce-input.directive';
import { HolidaysService } from './holidays/holidays.service';
import { MaterialModule } from './material.module';
import { AmountPipe } from './pipes/amount.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { MomentPipe } from './pipes/moment.pipe';

@NgModule({
  declarations: [DurationPipe, MomentPipe, DebounceInputDirective, AmountPipe],
  providers: [DecimalPipe, Location, { provide: LocationStrategy, useClass: PathLocationStrategy }, InitializationService, HolidaysService],
  imports: [CommonModule, HammerModule],
  exports: [DurationPipe, MomentPipe, DebounceInputDirective, MaterialModule, FlexLayoutModule, LayoutModule, AmountPipe]
})
export class ReportingCommonModule {}
