import {Component} from '@angular/core';
import {MomentPipe} from '../../pipe/moment/moment.pipe';
import * as moment from "moment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [MomentPipe]
})
export class HomeComponent {

  public title = 'Report!ng';

  constructor(private momentPipe: MomentPipe) {
  }

  public get today() {
    return this.momentPipe.transform(moment(), 'YYYY-MM');
  }
}
