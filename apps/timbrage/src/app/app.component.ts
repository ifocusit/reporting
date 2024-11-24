import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'ifocusit-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  title = 'timbrage';
}
