import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';
import { ReportingCommonModule } from 'projects/commons/src/public-api';

@NgModule({
  declarations: [BillComponent],
  imports: [CommonModule, BillRoutingModule, ReportingCommonModule]
})
export class BillModule {}
