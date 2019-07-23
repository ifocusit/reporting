import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, mergeMap, take, filter } from 'rxjs/operators';
import { Settings } from '../model/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore) {}

  public read(projectName: string): Observable<Settings> {
    return this.fireauth.user.pipe(
      mergeMap(user =>
        this.firestore
          .collection<Settings>(`users/${user.uid}/settings`, ref => ref.where('projectName', '==', projectName).limit(1))
          .valueChanges()
      ),
      map(result => result[0])
    );
  }

  public save(settings: Settings): Observable<Settings> {
    return this.fireauth.user.pipe(
      mergeMap(user =>
        this.firestore
          .collection<Settings>(`users/${user.uid}/settings`)
          .doc(settings.projectName)
          .set(settings)
      ),
      take(1),
      map(() => settings)
    );
  }
}
