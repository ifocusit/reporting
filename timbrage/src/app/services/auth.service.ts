import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, filter, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { auth } from 'firebase/app';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  myCustomData?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore) {}

  connectedUser(): Observable<User> {
    return this.fireauth.authState.pipe(
      map(credential => {
        if (credential) {
          return {
            uid: credential.uid,
            email: credential.email,
            displayName: credential.displayName || credential.email,
            photoURL: credential.photoURL
          } as User;
        }
        return { displayName: 'nobody' } as User;
      })
    );
  }

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

  private updateUserData(user: User) {
    // Sets user data to firestore on login
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    } as User;

    return this.firestore.doc(`users/${user.uid}`).set(data, { merge: true });
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
}
