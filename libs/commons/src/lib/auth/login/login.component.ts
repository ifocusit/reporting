import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { UserService } from '../user/user.service';

@Component({
  selector: 'lib-login',
  template: ` <firebase-ui (signInSuccessWithAuthResult)="successCallback($event)"></firebase-ui> `
})
export class LoginComponent {
  constructor(private userService: UserService, private router: Router) {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.userService.updateUserData(signInSuccessData.authResult.user as User).then(() => this.router.navigate(['/']));
  }
}
