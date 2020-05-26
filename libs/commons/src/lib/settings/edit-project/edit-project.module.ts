import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportingCommonModule } from '../../reporting-common.module';
import { EditProjectComponent } from './edit-project.component';

@NgModule({
  declarations: [EditProjectComponent],
  imports: [CommonModule, ReportingCommonModule, FormsModule],
  exports: [EditProjectComponent]
})
export class EditProjectModule {}
