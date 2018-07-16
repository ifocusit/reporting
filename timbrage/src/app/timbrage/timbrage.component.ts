import {Component, OnDestroy, OnInit} from '@angular/core';
import {Time} from "../model/time.model";

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit, OnDestroy {
  now = new Date();
  timerDay: any;

  times: Time[] = [];

  constructor() { }

  ngOnInit() {
    this.timerDay = setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerDay) clearInterval(this.timerDay);
  }

  get sumDay() {
    return 0;
  }

  public addTimbrage() {
    this.times.push(new Time());
  }
}
