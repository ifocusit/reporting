import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule, DecimalPipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { InitializationService } from './app';
import { DebounceInputDirective } from './form/debounce-input.directive';
import { HolidaysService } from './holidays/holidays.service';
import { MaterialModule } from './material.module';
import { AmountPipe } from './pipes/amount.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { MomentPipe } from './pipes/moment.pipe';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  } as any;
}

@NgModule({
  declarations: [DurationPipe, MomentPipe, DebounceInputDirective, AmountPipe],
  providers: [
    DecimalPipe,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    InitializationService,
    HolidaysService
  ],
  imports: [CommonModule, HammerModule],
  exports: [DurationPipe, MomentPipe, DebounceInputDirective, MaterialModule, FlexLayoutModule, LayoutModule, AmountPipe]
})
export class ReportingCommonModule {}
