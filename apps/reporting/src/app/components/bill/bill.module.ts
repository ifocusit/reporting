import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilesModule, ReportingCommonModule, SelectProjectModule } from '@ifocusit/commons';
import { EditBillService } from '../../services/edit-bill.service';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';

@NgModule({
  declarations: [BillComponent],
  providers: [EditBillService],
  imports: [CommonModule, BillRoutingModule, ReportingCommonModule, SelectProjectModule, FormsModule, FilesModule]
})
export class BillModule {}
