import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User, DEFAULT_USER } from './user/user.model';
import { filter, mergeMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore) {}

  public get user$(): Observable<User> {
    return this.fireauth.user.pipe(
      filter(user => !!user),
      mergeMap(user => this.firestore.doc<User>(`users/${user.uid}`).valueChanges()),
      map(user => ({ ...DEFAULT_USER, ...user }))
    );
  }

  public signOutUser() {
    return this.fireauth.auth.signOut();
  }
}
