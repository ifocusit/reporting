import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take, catchError, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import * as _ from 'lodash';
import { Settings, DEFAULT_SETTINGS } from './settings.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private authService: AuthService, private firestore: AngularFirestore, private firestorage: AngularFireStorage) {}

  public get projects$(): Observable<string[]> {
    return this.authService.user$.pipe(
      mergeMap(user => this.firestore.collection<{ project: { name: string } }>(`users/${user.uid}/projects`).valueChanges()),
      map(results => results.map(result => result.project.name))
    );
  }

  public delete(projectName: string) {
    return this.authService.user$.pipe(
      mergeMap(user => this.firestore.doc(`users/${user.uid}/projects/${projectName}`).delete()),
      mergeMap(() => this.authService.user$),
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}`).delete())
    );
  }

  public settings$(projectName: string): Observable<Settings> {
    return this.authService.user$.pipe(
      mergeMap(user => this.firestore.doc<Settings>(`users/${user.uid}/projects/${projectName}`).valueChanges()),
      map(data => _.merge({}, DEFAULT_SETTINGS, data, { project: { name: projectName } }))
    );
  }

  public getSettings(projectName: string): Observable<Settings> {
    return this.settings$(projectName).pipe(take(1));
  }

  public saveSettings(settings: Settings): Observable<Settings> {
    return this.authService.user$.pipe(
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
    return this.authService.user$.pipe(
      mergeMap(user => this.firestorage.upload(`users/${user.uid}/${projectName}/logo.png`, file).snapshotChanges())
    );
  }

  public readLogo(projectName: string): Observable<string> {
    return this.authService.user$.pipe(
      mergeMap(user => this.firestorage.ref(`users/${user.uid}/${projectName}/logo.png`).getDownloadURL()),
      take(1),
      catchError(() => of(true))
    );
  }
}
