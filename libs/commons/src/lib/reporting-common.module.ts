import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { DebounceInputDirective } from './form/debounce-input.directive';
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
    }
  ],
  imports: [CommonModule],
  exports: [DurationPipe, MomentPipe, DebounceInputDirective, MaterialModule, FlexLayoutModule, LayoutModule, AmountPipe]
})
export class ReportingCommonModule {}
