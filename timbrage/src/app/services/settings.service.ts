import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { SettingsState, SettingsStateModel } from '../store/settings.store';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private store: Store) {}

  public get(): SettingsStateModel {
    return this.store.selectSnapshot(SettingsState);
  }

  public getEndOfDay(): Moment {
    return this.applyEndOfDay();
  }

  public applyEndOfDay(date: Moment = moment()): Moment {
    const state = this.get();
    date.hour(state.endOfDay.hour);
    date.minute(state.endOfDay.minute);
    date.second(0);

    return date;
  }
}
