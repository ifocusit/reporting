import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take, catchError, tap, defaultIfEmpty, filter } from 'rxjs/operators';
import { Settings, DEFAULT_SETTINGS } from '../model/settings.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private firestorage: AngularFireStorage) {}

  get projects$(): Observable<string[]> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.collection<{ projectName: string }>(`users/${user.uid}/projects`).valueChanges()),
      map(results => results.map(result => result.projectName))
    );
  }

  public delete(projectName: string) {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.doc(`users/${user.uid}/projects/${projectName}`).delete()),
      mergeMap(() => this.fireauth.user),
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}`).delete())
    );
  }

  public read(projectName: string): Observable<Settings> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.doc<Settings>(`users/${user.uid}/projects/${projectName}`).valueChanges()),
      map(data => ({ ...DEFAULT_SETTINGS, ...data, projectName: projectName }))
    );
  }

  public saveSettings(settings: Settings): Observable<Settings> {
    return this.fireauth.user.pipe(
      mergeMap(user =>
        this.firestore
          .collection<Settings>(`users/${user.uid}/projects`)
          .doc(settings.projectName)
          .set(settings)
      ),
      take(1),
      map(() => settings)
    );
  }

  public uploadLogo(file: File, projectName: string): Observable<UploadTaskSnapshot> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestorage.upload(`users/${user.uid}/${projectName}/logo.png`, file).snapshotChanges())
    );
  }

  public readLogo(projectName: string): Observable<string> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}/logo.png`).getDownloadURL()),
      take(1),
      catchError(error => {
        console.log(error);
        return of(true);
      })
    );
  }
}
