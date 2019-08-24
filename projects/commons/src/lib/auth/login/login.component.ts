import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'lib-login',
  template: `
    <firebase-ui (signInSuccessWithAuthResult)="successCallback($event)"></firebase-ui>
  `
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {
    // firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.authService.updateUserData(signInSuccessData.authResult.user);
  }
}
