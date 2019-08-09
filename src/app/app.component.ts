import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reporting';

  public user$;

  constructor(private fireauth: AngularFireAuth) {
    this.user$ = this.fireauth.user;
  }

  signout() {
    this.fireauth.auth.signOut();
  }
}
