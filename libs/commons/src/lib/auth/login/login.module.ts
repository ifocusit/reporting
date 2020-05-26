import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

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
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, FirebaseUIModule.forRoot(firebaseUiAuthConfig)]
})
export class LoginModule {}
