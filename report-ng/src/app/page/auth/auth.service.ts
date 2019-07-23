import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private profileService: ProfileService) {}

  async googleSignin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.fireauth.auth
        .signInWithPopup(provider)
        .then(credential => this.updateUserData(credential.user))
        .then(res => {
          resolve(res);
        });
    });
    // const provider = new auth.GoogleAuthProvider();
    // return this.fireauth.auth.signInWithPopup(provider).then(credential => this.updateUserData(credential.user));
  }

  createNewUser(email: string, password: string) {
    return this.fireauth.auth.createUserWithEmailAndPassword(email, password).then(credential => this.updateUserData(credential.user));
  }

  signInUser(email: string, password: string) {
    return this.fireauth.auth.signInWithEmailAndPassword(email, password).then(credential => this.updateUserData(credential.user));
  }

  signOutUser() {
    return this.fireauth.auth.signOut();
  }

  private updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    } as User;

    return this.firestore.doc(`users/${user.uid}`).set(data, { merge: true });
  }
}
