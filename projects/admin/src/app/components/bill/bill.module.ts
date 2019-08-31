import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';
import { ReportingCommonModule } from 'projects/commons/src/public-api';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';
import { BillService } from '../../services/bill.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BillComponent],
  providers: [BillService],
  imports: [CommonModule, BillRoutingModule, ReportingCommonModule, SelectProjectModule, FormsModule]
})
export class BillModule {}
