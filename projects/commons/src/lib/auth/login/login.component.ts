import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { UserService } from '../user/user.service';

@Component({
  selector: 'lib-login',
  template: `
    <firebase-ui (signInSuccessWithAuthResult)="successCallback($event)"></firebase-ui>
  `
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService) {
    // firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.userService.updateUserData(signInSuccessData.authResult.user);
  }
}
