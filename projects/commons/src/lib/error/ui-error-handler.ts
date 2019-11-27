import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BusinessError } from './business.error';

@Injectable()
export class UIErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error: Error) {
    if (error instanceof BusinessError) {
      this.injector.get(MatSnackBar).open(error.message, null, { duration: 2000 });
    } else {
      super.handleError(error);
    }
  }
}
