import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AuthService } from './auth.service';
import { UserService } from './user/user.service';

@NgModule({
  declarations: [],
  imports: [
    // firebase
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [AuthService, UserService]
})
export class AuthModule {}
