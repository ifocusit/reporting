import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User } from '../auth/user/user.model';
import { UserService } from '../auth/user/user.service';
import { SettingsState } from '../settings/settings.store';
import { TimesState } from '../times/time.store';
import { Bill, DEFAULT_BILL } from './bill.model';

export interface BillData {
  user: User;
  project: string;
  month: string;
}

@Injectable()
export class BillService {
  constructor(protected userService: UserService, protected firestore: AngularFirestore, protected store: Store) {}

  protected readData(): Observable<BillData> {
    return this.userService.user$.pipe(
      mergeMap(user =>
        this.store
          .select(SettingsState.project)
          .pipe(mergeMap(project => this.store.select(TimesState.selectedMonth).pipe(map(month => ({ user, project, month })))))
      )
    );
  }

  public get bill$(): Observable<Bill> {
    return this.readData().pipe(
      mergeMap(data => this.firestore.doc<Bill>(`users/${data.user.uid}/projects/${data.project}/bills/${data.month}`).valueChanges()),
      map(bill => ({ ...DEFAULT_BILL, ...bill }))
    );
  }
}
