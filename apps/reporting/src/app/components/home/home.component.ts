import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService, ProjectService } from '@ifocusit/commons';
import { Store } from '@ngxs/store';

@Component({
  selector: 'ifocusit-home',
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
