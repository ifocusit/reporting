import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './file-size.pipe';
import { DropZoneDirective } from './drop-zone.directive';
import { BrowserModule } from '@angular/platform-browser';
import { ReportingCommonModule } from '../reporting-common.module';

@NgModule({
  declarations: [FileUploadComponent, FileSizePipe, DropZoneDirective],
  imports: [ReportingCommonModule, BrowserModule],
  providers: [],
  exports: [FileUploadComponent, FileSizePipe, DropZoneDirective]
})
export class FilesModule {}
