import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { UserService } from '../user/user.service';

@Component({
  selector: 'lib-login',
  template: `
    <firebase-ui (signInSuccessWithAuthResult)="successCallback($event)"></firebase-ui>
  `
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.userService.updateUserData(signInSuccessData.authResult.user).then(() => this.router.navigate(['/']));
  }
}
