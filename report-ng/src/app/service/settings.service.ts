import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take, pairwise, catchError } from 'rxjs/operators';
import { Settings } from '../model/settings.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private firestorage: AngularFireStorage) {}

  get projects$(): Observable<string[]> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.collection<{ projectName: string }>(`users/${user.uid}/settings`).valueChanges()),
      map(results => results.map(result => result.projectName))
    );
  }

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

  uploadLogo(file: File, projectName: string): Observable<UploadTaskSnapshot> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestorage.upload(`users/${user.uid}/${projectName}/logo.png`, file).snapshotChanges())
    );
  }

  public readLogo(projectName: string): Observable<string> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}/logo.png`).getDownloadURL()),
      catchError(error => {
        console.log(error);
        return of(true);
      })
    );
  }

  public removeSettings(projectName: string) {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.doc(`users/${user.uid}/settings/${projectName}`).delete()),
      mergeMap(() => this.fireauth.user),
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}`).delete())
    );
  }
}
