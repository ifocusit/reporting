import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Time, TimeAdapter } from 'projects/commons/src/lib/times/time.model';
import { CheckWriteRights, DeleteTime, UpdateTime } from 'projects/commons/src/lib/times/time.store';

@Component({
  selector: 'app-time',
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

  private static getIndex(index: number) {
    index = Math.max(index, 1);
    return index > 1 ? index - 1 : index;
  }

  public startEditing() {
    this.store.dispatch(new CheckWriteRights()).subscribe(_ => {
      this.editing = true;
      setTimeout(() => {
        const nativeElt = this.myElement.nativeElement;
        nativeElt.querySelector(`#hours button:nth-child(${TimeComponent.getIndex(this.time.hours())})`).scrollIntoView();
        nativeElt.querySelector(`#minutes button:nth-child(${TimeComponent.getIndex(this.time.minutes())})`).scrollIntoView();
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
