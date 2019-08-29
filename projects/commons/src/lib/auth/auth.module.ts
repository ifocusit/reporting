import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AuthService } from './auth.service';

@NgModule({
  declarations: [],
  imports: [
    // firebase
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [AuthService]
})
export class AuthModule {}
