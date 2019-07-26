import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore) {}

  get user$(): Observable<User> {
    return this.fireauth.user.pipe(mergeMap(user => this.firestore.doc<User>(`users/${user.uid}`).valueChanges()));
  }

  public update(user: User) {
    return this.firestore.doc(`users/${user.uid}`).set(user, { merge: true });
  }
}
