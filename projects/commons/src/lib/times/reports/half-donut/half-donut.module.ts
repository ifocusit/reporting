import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { HalfDonutComponent } from './half-donut.component';
import { MonthGraphDialogComponent } from './month-graph.dialog';

@NgModule({
  declarations: [HalfDonutComponent, MonthGraphDialogComponent],
  imports: [CommonModule, FlexLayoutModule, TranslateModule.forRoot()],
  exports: [HalfDonutComponent],
  entryComponents: [MonthGraphDialogComponent]
})
export class HalfDonutModule {}
