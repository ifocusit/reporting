import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirebaseUIModule, firebaseui, firebase } from 'firebaseui-angular';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

const firebaseUiAuthConfig = {
  signInFlow: 'redirect',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: true,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '/',
  // tosUrl: '/',
  // privacyPolicyUrl: '/',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, FirebaseUIModule.forRoot(firebaseUiAuthConfig)]
})
export class LoginModule {}
