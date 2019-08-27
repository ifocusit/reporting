import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take, catchError } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import * as _ from 'lodash';
import { Settings, DEFAULT_SETTINGS } from './settings.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private fireauth: AngularFireAuth, private firestore: AngularFirestore, private firestorage: AngularFireStorage) {}

  public get projects$(): Observable<string[]> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.collection<{ project: { name: string } }>(`users/${user.uid}/projects`).valueChanges()),
      map(results => results.map(result => result.project.name))
    );
  }

  public delete(projectName: string) {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.doc(`users/${user.uid}/projects/${projectName}`).delete()),
      mergeMap(() => this.fireauth.user),
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}`).delete())
    );
  }

  public readSettings(projectName: string): Observable<Settings> {
    return this.fireauth.user.pipe(
      mergeMap(user => this.firestore.doc<Settings>(`users/${user.uid}/projects/${projectName}`).valueChanges()),
      map(data => _.merge(DEFAULT_SETTINGS, data, { project: { name: projectName } }))
    );
  }

  public saveSettings(settings: Settings): Observable<Settings> {
    return this.fireauth.user.pipe(
      mergeMap(user =>
        this.firestore
          .collection<Settings>(`users/${user.uid}/projects`)
          .doc(settings.project.name)
          .set(settings, { merge: true })
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
