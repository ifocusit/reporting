import { Component, OnInit } from '@angular/core';
import { InitializationService } from '@ifocusit/commons';

@Component({
  selector: 'ifocusit-root',
  template: `<main role="main"><router-outlet></router-outlet></main>`,
  styles: [
    `
      @media print {
        mat-toolbar {
          display: none;
        }
      }
    `
  ]
})
export class AppComponent implements OnInit {
  constructor(private readonly initializationService: InitializationService) {}

  ngOnInit() {
    this.initializationService.initialize();
  }
}
