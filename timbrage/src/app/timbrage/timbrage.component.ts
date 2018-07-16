import {Component, OnDestroy, OnInit} from '@angular/core';
import {Time} from "../model/time.model";
import {CalculationService} from "../calculation.service";
import * as moment from "moment";
import {Duration} from "moment";

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.scss']
})
export class TimbrageComponent implements OnInit, OnDestroy {
  now = new Date();
  timerDay: any;

  times: Time[] = [];

  sumDay: Duration = moment.duration();

  constructor(private calculationService: CalculationService) { }

  ngOnInit() {
    this.startTimers();
  }

  private startTimers(): void {

    this.timerDay = setInterval(() => {
      this.now = new Date();
      this.calculationService.calculate(this.times).then((duration) => this.sumDay = duration);
    }, 1000);

    // this.timerWeek = setInterval(() => {
    //   this.storageService.find(moment().startOf('week'), moment().endOf('week')).then((timbrages) => {
    //     this.calculationService.calculate(timbrages).then((duration) => this.sumWeek = duration);
    //   });
    // }, 1000);

    // this.timerMonth = setInterval(() => {
    //   this.storageService.find(moment().startOf('month'), moment().endOf('month')).then((timbrages) => {
    //     this.calculationService.calculate(timbrages).then((duration) => this.sumMonth = duration);
    //   });
    // }, 1000);
  }

  private stopTimers() {
    if (this.timerDay) clearInterval(this.timerDay);
    // if (this.timerWeek) clearInterval(this.timerWeek);
    // if (this.timerMonth) clearInterval(this.timerMonth);
  }

  ngOnDestroy(): void {
    this.stopTimers()
  }

  public addTimbrage() {
    this.times.push(new Time());
  }
}
