import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AuthService } from './../auth/auth.service';
import { TimesService } from './times.service';

describe('TimesService', () => {
  let firestore: AngularFirestore;
  let authService: AuthService;
  let store: Store;
  let translateService: TranslateService;

  let service: TimesService;

  beforeEach(() => {
    firestore = ({ collection: jest.fn(), doc: jest.fn() } as unknown) as AngularFirestore;
    authService = ({ user$: jest.fn() } as unknown) as AuthService;
    store = ({ selectSnapshot: jest.fn() } as unknown) as Store;
    translateService = ({ instant: jest.fn() } as unknown) as TranslateService;

    service = new TimesService(firestore, authService, store, translateService);
  });

  test('should read time beetween 2 dates', done => {
    const date = '2020-05-25';
    service.readBetween = jest.fn();
    service.read(date).subscribe(() => {
      expect(service.readBetween).toHaveBeenCalledWith(moment(date).startOf('day'), moment(date).endOf('day'));
      done();
    });
  });
});
