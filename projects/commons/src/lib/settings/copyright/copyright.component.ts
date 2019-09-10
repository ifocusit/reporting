import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'lib-copyright',
  template: `
    &copy; {{ date }}, Focus IT sàrl.
  `,
  styles: [
    `
      :host {
        padding: 1em;
      }
    `
  ]
})
export class CopyrightComponent implements OnInit {
  public date = moment().format('YYYY');

  constructor() {}

  ngOnInit() {}
}
