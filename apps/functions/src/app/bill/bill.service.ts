import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { range } from 'lodash';
import * as moment from 'moment';
import { Duration, Moment } from 'moment';
import { combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  CalculateDuration,
  calculateMustHours,
  calculateWorkDuration,
  calculateWorkedDays,
  sumLinesAmount
} from '../utils/calculate-duration.tools';
import { SettingsService } from './../settings/settings.service';
import { DATE_ISO_FORMAT, TimeService } from './../time/time.service';

export interface BillLine {
  id?: string;
  label: string;
  amount?: number;
}

export interface BillDetail {
  nbWorkDays: number;
  mustWorkDuration: string;
  timeWorkDuration: string;
  hourlyRate: number;
  tvaRate: number;
  linesAmountHt: number;
}

export interface Bill {
  archived: boolean;
  billUrl?: string;
  detail?: BillDetail;
}

export class WorkingDateReporting {
  public hasTimes: boolean;
  public isWeekend: boolean;
  public isNotComplete: boolean;
  public isHoliday: boolean;
  public duration: Duration;

  constructor(public date: Moment, public times: Moment[] = []) {
    this.isWeekend = [6, 0].indexOf(date.day()) > -1;
    this.hasTimes = times && times.length > 0;
    this.isNotComplete = times.length % 2 !== 0;

    this.duration = CalculateDuration(this.times);

    // les jours vides et avant le jour en cours sont marqué comme congé
    this.isHoliday = !this.hasTimes && !this.isWeekend && this.date.isBefore(moment().startOf('day'));
  }

  public isSameDate(date: string): boolean {
    return this.date.format(DATE_ISO_FORMAT) === date;
  }
}

@Injectable()
export class BillService {
  constructor(private timeService: TimeService, private settingsService: SettingsService) {}

  freeze(user: string, project: string, month: string): Promise<Bill> {
    const currentMonth = moment(month);
    const db = firebase.firestore();

    const billDocPath = `users/${user}/projects/${project}/bills/${month}`;
    return db
      .doc(billDocPath)
      .get()
      .then(docs => docs.data() as Bill)
      .then(bill => {
        if (!bill) {
          throw new NotFoundException(`Bill ${billDocPath} not found!`);
        }
        if (!bill.billUrl) {
          throw new UnprocessableEntityException(`Bill cannot be freeze without uploaded PDF!`);
        }
        return combineLatest([
          this.settingsService.settings(user, project),
          this.timeService.times(user, project, month),
          this.lines(user, project, month)
        ])
          .pipe(
            map(data => {
              const settings = data[0];
              const times = data[1];
              const lines = data[2];

              const days = range(currentMonth.daysInMonth())
                .map(index => new WorkingDateReporting(currentMonth.clone().date(index + 1)))
                .map(
                  day =>
                    new WorkingDateReporting(
                      day.date,
                      times.filter(time => day.isSameDate(time.format(DATE_ISO_FORMAT)))
                    )
                );
              const nbWorkDays = calculateWorkedDays(days);
              const mustDuration = calculateMustHours(nbWorkDays, settings);
              const total = calculateWorkDuration(days);

              return {
                ...bill,
                archived: true,
                detail: {
                  nbWorkDays: nbWorkDays,
                  mustWorkDuration: mustDuration.toISOString(),
                  timeWorkDuration: total.toISOString(),
                  hourlyRate: settings.bill.hourlyRate,
                  linesAmountHt: sumLinesAmount(lines),
                  tvaRate: settings.bill.tvaRate
                }
              };
            }),
            mergeMap(newBill =>
              db
                .doc(billDocPath)
                .set(newBill)
                .then(() => newBill)
            )
          )
          .toPromise();
      });
  }

  public lines(user: string, project: string, month: string): Promise<BillLine[]> {
    return firebase
      .firestore()
      .collection(`users/${user}/projects/${project}/bills/${month}/lines`)
      .orderBy('timestamp')
      .get()
      .then(results => results.docs.map(doc => doc.data() as BillLine));
  }
}
