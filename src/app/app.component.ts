import { Component } from '@angular/core';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reporting';

  public user$;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  signout() {
    this.authService.signOutUser();
  }
}
