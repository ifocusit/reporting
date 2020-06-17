import { Settings } from '@ifocusit/commons';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { BillLine, WorkingDateReporting } from '../bill/bill.service';

export function CalculateDuration(timbrages: Moment[]): Duration {
  let duration = moment.duration();

  if (!timbrages || timbrages.length < 2) {
    // no _times
    return duration;
  }
  // calculate duration by pairs of Timbrage
  splitPairs(timbrages).forEach(pair => {
    duration = duration.add(diff(pair[1], pair[0]));
  });

  return duration;
}

function diff(t1: Moment, t0: Moment): Duration {
  const difference = t1.diff(t0);
  return moment.duration(difference);
}

function splitPairs(arr: Array<Moment>, ignoreSingle = true): Array<Array<Moment>> {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i + 1] !== undefined) {
      pairs.push([arr[i], arr[i + 1]]);
    } else if (!ignoreSingle) {
      pairs.push([arr[i]]);
    }
  }
  return pairs;
}

export const calculateProgression = (overtime: Duration, total: Duration, mustHours: Duration): number => {
  if (mustHours.asHours() === 0) {
    return 0;
  }
  return ((total.asHours() - Math.max(overtime.asHours(), 0)) * 100) / (Math.max(overtime.asHours(), 0) + mustHours.asHours());
};

export const calculateOvertimeDuration = (total: Duration, mustHours: Duration): Duration => {
  return total.clone().subtract(mustHours);
};

export const calculateWorkDuration = (days: WorkingDateReporting[]): Duration => {
  return days.map(report => report.duration).reduce((d1, d2) => d1.clone().add(d2));
};

export const calculateMustHours = (nbWorkDays: number, settings: Settings): Duration => {
  return moment.duration(nbWorkDays * settings.timbrage.dailyReport, 'hours');
};

export const calculateWorkedDays = (days: WorkingDateReporting[]): number => {
  return days.filter(day => !day.isHoliday && !day.isWeekend).length;
};

export const calculatWorkAmount = (duration: Duration, hourlyRate: number): number => {
  return duration.asHours() * hourlyRate;
};

export const sumLinesAmount = (lines: BillLine[]): number => {
  const amounts = lines.map(line => +line.amount).filter(value => !Number.isNaN(value));
  return amounts.length > 0 ? amounts.reduce((accu, currentValue) => accu + currentValue) : 0;
};

export const calculateHT = (duration: Duration, hourlyRate: number, lines: BillLine[]) => {
  return this.sumLinesAmount(lines) + this.calculatWorkAmount(duration, hourlyRate);
};

export const calculateTVA = (duration: Duration, hourlyRate: number, tvaRate: number, lines: BillLine[]) => {
  return (this.calculateHT(duration, hourlyRate, lines) * tvaRate) / 100;
};

export const calculateTTC = (duration: Duration, hourlyRate: number, tvaRate: number, lines: BillLine[]) => {
  return this.calculateHT(duration, hourlyRate, lines) + this.calculateTVA(duration, hourlyRate, tvaRate, lines);
};