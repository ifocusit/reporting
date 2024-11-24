import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportingCommonModule } from '@ifocusit/commons';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, ReportingCommonModule],
  selector: 'ifocusit-root',
  template: `
    <mat-toolbar color="primary">Hello</mat-toolbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
