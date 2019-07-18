import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    /*return this.authService.user$.pipe(
      take(1),
      map(user => !!user),
      tap(user => {
        if (!user) {
          this.router.navigate(['/auth']);
        }
      })
    );*/
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/auth']);
          resolve(false);
        }
      });
    });
  }
}
