import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { mergeMap, take, map, filter } from 'rxjs/operators';
import { User, DEFAULT_USER } from './user.model';

@Injectable()
export class UserService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore) {}

  public get user$(): Observable<User> {
    return this.fireauth.user.pipe(
      filter(user => !!user),
      mergeMap(user => this.firestore.doc<User>(`users/${user.uid}`).valueChanges()),
      map(user => ({ ...DEFAULT_USER, ...user }))
    );
  }

  public updateUser(data: User) {
    return this.user$.pipe(
      take(1),
      mergeMap(user => this.firestore.doc<User>(`users/${user.uid}`).set({ ...data, uid: user.uid }, { merge: true }))
    );
  }

  public updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const data = {
      uid: user.uid,
      email: user.email
    } as User;

    if (user.displayName) {
      data.displayName = user.displayName;
    }
    if (user.photoURL) {
      data.photoURL = user.photoURL;
    }
    if (user.phoneNumber) {
      data.phoneNumber = user.phoneNumber;
    }

    return this.firestore.doc(`users/${user.uid}`).set(data, { merge: true });
  }
}
