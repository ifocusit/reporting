import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UIErrorHandler } from './ui-error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSnackBarModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: UIErrorHandler
    }
  ],
  exports: []
})
export class ErrorsHandlingModule {}
