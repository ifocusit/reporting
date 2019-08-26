import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Component({
  selector: 'lib-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() upload: (file: File) => Observable<UploadTaskSnapshot>;
  @Input() downloadURL: Promise<string>;

  task$: Observable<UploadTaskSnapshot>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor() {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // const path = `test/${new Date().getTime()}_${file.name}`;
    // const customMetadata = { app: 'My AngularFire-powered PWA!' };
    // this.task = this.storage.upload(path, file, { customMetadata });

    // The main task
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
