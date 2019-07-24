import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { Settings } from '../model/settings.model';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private firestorage: AngularFireStorage) {}

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

  uploadLogo(file: File, projectName: string): Observable<string> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestorage.upload(`users/${user.uid}/${projectName}/logo.png`, file).snapshotChanges()),
      map(data => data.state)
    );
  }

  public readLogo(projectName: string): Observable<string> {
    return this.fireauth.user.pipe(mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}/logo.png`).getDownloadURL()));
  }
}
