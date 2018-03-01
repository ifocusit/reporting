import {Component} from '@angular/core';
import {MomentPipe} from '../../pipe/moment/moment.pipe';
import moment = require('moment');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MomentPipe]
})
export class HomeComponent {

  constructor(private momentPipe: MomentPipe) {
  }

  public get title(): string {
    return 'Report!ng';
  }

  public get today() {
    return this.momentPipe.transform(moment(), 'YYYY-MM');
  }
}
