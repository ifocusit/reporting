import { Time, TimeAdapter } from '../../models/time.model';
import { Store } from '@ngxs/store';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DeleteTime, UpdateTime } from '../../store/time.store';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  @Input() set model(model: Time) {
    this._model = model;
    this.time = new TimeAdapter(model).getMoment();
  }

  constructor(private myElement: ElementRef, private store: Store) {
    for (let i = 0; i < 24; i++) {
      this.hours.push(`${i}`.padStart(2, '0'));
    }
    for (let i = 0; i < 60; i++) {
      this.minutes.push(`${i}`.padStart(2, '0'));
    }
  }

  @Input()
  public odd: boolean;

  private _model: Time;

  public time: Moment;
  public hours = [];

  public minutes = [];

  editing = false;

  private static getIndex(index: number) {
    index = Math.max(index, 1);
    return index > 1 ? index - 1 : index;
  }

  ngOnInit() {}

  public startEditing() {
    this.editing = true;
    setTimeout(() => {
      const nativeElt = this.myElement.nativeElement;
      nativeElt.querySelector(`#hours button:nth-child(${TimeComponent.getIndex(this.time.hours())})`).scrollIntoView();
      nativeElt.querySelector(`#minutes button:nth-child(${TimeComponent.getIndex(this.time.minutes())})`).scrollIntoView();
    });
  }

  public submit() {
    this.editing = false;
    this.store.dispatch(new UpdateTime(TimeAdapter.createTime(this.time, this._model.id)));
    this.time = moment(this.time);
  }

  public delete() {
    this.store.dispatch(new DeleteTime(this._model));
  }

  public revert() {
    this.editing = false;
  }
}
