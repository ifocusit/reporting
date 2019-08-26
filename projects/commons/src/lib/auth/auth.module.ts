import { NgModule } from '@angular/core';

import { FirebaseUIModule, firebaseui, firebase } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from 'src/environments/environment.prod';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';

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
  imports: [
    // firebase
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [AuthService],
  exports: [LoginComponent]
})
export class AuthModule {}
