import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { HalfDonutComponent } from './half-donut.component';
import { MonthGraphDialog } from './month-graph.dialog';

@NgModule({
  declarations: [HalfDonutComponent, MonthGraphDialog],
  imports: [CommonModule, FlexLayoutModule, TranslateModule.forRoot()],
  exports: [HalfDonutComponent],
  entryComponents: [MonthGraphDialog]
})
export class HalfDonutModule {}
