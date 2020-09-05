import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { of } from 'rxjs';
import { UserService } from '../auth/user/user.service';
import { TimesService } from './times.service';

describe('TimesService', () => {
  let firestore: AngularFirestore;
  let userService: UserService;
  let store: Store;
  let translateService: TranslateService;

  let service: TimesService;

  beforeEach(() => {
    firestore = ({ collection: jest.fn(), doc: jest.fn() } as unknown) as AngularFirestore;
    userService = ({ user$: jest.fn() } as unknown) as UserService;
    store = ({ selectSnapshot: jest.fn() } as unknown) as Store;
    translateService = ({ instant: jest.fn() } as unknown) as TranslateService;

    service = new TimesService(firestore, userService, store, translateService);
  });

  test('should read time beetween 2 dates', done => {
    const date = '2020-05-25';
    service.readBetween = jest.fn().mockImplementation(() => of(''));
    service.read(date).subscribe(() => {
      expect(service.readBetween).toHaveBeenCalledWith(moment(date).startOf('day'), moment(date).endOf('day'));
      done();
    });
  });
});
