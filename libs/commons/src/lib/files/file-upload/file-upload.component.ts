import { Component, Input } from '@angular/core';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'lib-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() upload: (file: File) => Observable<UploadTaskSnapshot>;
  @Input() downloadURL: Promise<string>;
  @Input() thumbnail: boolean = true;

  task$: Observable<UploadTaskSnapshot>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor() {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    const file = event.item(0);

    this.task$ = this.upload(file).pipe(
      tap(task => {
        if (task.bytesTransferred === task.totalBytes) {
          // Update firestore on completion
          this.downloadURL = task.ref.getDownloadURL();
          this.task$ = undefined;
        }
      })
    );
  }

  calculatePercent(task: UploadTaskSnapshot): number {
    return (task.bytesTransferred / task.totalBytes) * 100;
  }

  // Determines if the upload task is active
  isActive(task: UploadTaskSnapshot) {
    return task.state === 'running' && task.bytesTransferred < task.totalBytes;
  }
}
