import { Component } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'lib-copyright',
  template: ` &copy; {{ date }}, Focus IT sàrl. `,
  styles: [
    `
      :host {
        padding: 1em;
      }
    `
  ]
})
export class CopyrightComponent {
  public date = moment().format('YYYY');
}
