import { Component } from '@angular/core';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Timbrage';

  constructor(private authService: AuthService) {}

  public logout() {
    this.authService.signOutUser();
  }
}
