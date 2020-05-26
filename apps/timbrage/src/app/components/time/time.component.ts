import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CheckWriteRights, DeleteTime, Time, TimeAdapter, UpdateTime } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'ifocusit-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  @Input() set model(model: Time) {
    this.innerModel = model;
    this.time = new TimeAdapter(model).getMoment();
  }

  @Input()
  public odd: boolean;

  private innerModel: Time;

  public time: Moment;
  public hours = [];

  public minutes = [];

  editing = false;

  constructor(private myElement: ElementRef, private store: Store) {
    for (let i = 0; i < 24; i++) {
      this.hours.push(`${i}`.padStart(2, '0'));
    }
    for (let i = 0; i < 60; i++) {
      this.minutes.push(`${i}`.padStart(2, '0'));
    }
  }

  ngOnInit() {}

  public startEditing() {
    this.store.dispatch(new CheckWriteRights()).subscribe(_ => {
      this.editing = true;
      setTimeout(() => {
        const nativeElt = this.myElement.nativeElement;

        const hourIndex = Math.max(this.time.hours(), 1);
        const minuteIndex = Math.max(this.time.minutes(), 1);

        nativeElt.querySelector(`#hours button:nth-child(${hourIndex})`).scrollIntoView();
        nativeElt.querySelector(`#minutes button:nth-child(${minuteIndex})`).scrollIntoView();
      });
    });
  }

  public submit() {
    this.editing = false;
    this.store.dispatch(new UpdateTime(TimeAdapter.createTime(this.time, this.innerModel.id)));
    this.time = moment(this.time);
  }

  public delete() {
    this.store.dispatch(new DeleteTime(this.innerModel));
  }

  public revert() {
    this.editing = false;
  }
}
