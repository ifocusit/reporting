import {Injectable} from '@angular/core';
import * as moment from "moment";
import {Moment} from "moment";

export class Settings {
  endOfDay = {
    hour: 18,
    minute: 0,
    second: 0
  };

  startOfDay = {
    hour: 8,
    minute: 0,
    second: 0
  };

  saveMissings = true;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings = new Settings();

  constructor() {
  }

  public get(): Settings {
    return this.settings;
  }

  public getEndOfDay(): Moment {
    return this.applyEndOfDay();
  }

  public applyEndOfDay(date: Moment = moment()): Moment {
    date.hour(this.settings.endOfDay.hour);
    date.minute(this.settings.endOfDay.minute);
    date.second(this.settings.endOfDay.second);

    return date;
  }
}
