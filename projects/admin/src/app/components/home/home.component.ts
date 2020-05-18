import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthService } from 'projects/commons/src/lib/auth/auth.service';
import { ProjectService } from 'projects/commons/src/lib/settings/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public user$ = this.authService.user$;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private store: Store, private authService: AuthService) {}

  signOut() {
    this.authService.signOutUser();
  }

  ngOnInit() {}
}
