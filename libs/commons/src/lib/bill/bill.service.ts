import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User } from '../auth/user/user.model';
import { UserService } from '../auth/user/user.service';
import { Settings } from '../settings';
import { SettingsState } from '../settings/settings.store';
import { DATETIME_ISO_FORMAT } from '../times';
import { TimesState } from '../times/time.store';
import { Bill } from './bill.model';

export interface BillData {
  user: User;
  settings: Settings;
  month: string;
}

@Injectable()
export class BillService {
  constructor(protected userService: UserService, protected firestore: AngularFirestore, protected store: Store) {}

  protected readData(): Observable<BillData> {
    return this.userService.user$.pipe(
      mergeMap(user =>
        this.store
          .select(SettingsState.settings)
          .pipe(mergeMap(settings => this.store.select(TimesState.selectedMonth).pipe(map(month => ({ user, settings, month })))))
      )
    );
  }

  private initializeBill(bill: Bill, month: string, settings: Settings): Bill {
    return {
      creationDate: (bill.archived ? moment(month).startOf('month').startOf('day') : moment()).format(DATETIME_ISO_FORMAT),
      ...bill,
      month,
      detail: {
        ...(bill && bill.detail
          ? bill.detail
          : {
              hourlyRate: settings.bill.hourlyRate,
              tvaRate: settings.bill.tvaRate
            })
      }
    };
  }

  public get bill$(): Observable<Bill> {
    return this.readData().pipe(
      mergeMap(data =>
        this.firestore
          .doc<Bill>(`users/${data.user.uid}/projects/${data.settings.project.name}/bills/${data.month}`)
          .valueChanges()
          .pipe(map(bill => this.initializeBill(bill, data.month, data.settings)))
      )
    );
  }

  public getBill$(month: string): Observable<Bill> {
    return this.userService.user$.pipe(
      mergeMap(user =>
        this.store.select(SettingsState.settings).pipe(
          mergeMap(settings =>
            this.firestore
              .doc<Bill>(`users/${user.uid}/projects/${settings.project.name}/bills/${month}`)
              .valueChanges()
              .pipe(map(bill => this.initializeBill(bill, month, settings)))
          )
        )
      )
    );
  }
}
