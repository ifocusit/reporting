import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private fireauth: AngularFireAuth) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.fireauth.authState.subscribe(user => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
