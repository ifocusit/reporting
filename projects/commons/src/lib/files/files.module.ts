import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './file-size.pipe';
import { DropZoneDirective } from './drop-zone.directive';
import { ReportingCommonModule } from '../reporting-common.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FileUploadComponent, FileSizePipe, DropZoneDirective],
  imports: [ReportingCommonModule, CommonModule],
  providers: [],
  exports: [FileUploadComponent, FileSizePipe, DropZoneDirective]
})
export class FilesModule {}
