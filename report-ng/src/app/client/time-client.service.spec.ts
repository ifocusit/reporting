import {inject, TestBed} from '@angular/core/testing';

import {TimeClient} from './time-client.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../environments/environment";
import {TIMES_TEST_DATA_MARS} from "../model/time-data.spec";
import {Time} from "../model/time.model";

describe('TimeClient', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimeClient]
    });

    environment.api = 'http://monserveur.com';
  });

  it('should be created', inject([TimeClient, HttpTestingController], (client, htppMock) => {
    expect(client).toBeTruthy();
    expect(htppMock).toBeTruthy();
  }));

  it('should call backend on getTimes', inject([TimeClient, HttpTestingController], (client, httpMock) => {
    client.getTimes$('A-MONTH')
      .subscribe((times) => expect(times).toBe(TIMES_TEST_DATA_MARS));

    httpMock.expectOne({
      method: 'GET',
      url: 'http://monserveur.com/_times/month/A-MONTH'
    }).flush(TIMES_TEST_DATA_MARS);
  }));

  it('should call backend on saveTime', inject([TimeClient, HttpTestingController], (client, httpMock) => {

    const saved = <Time>{
      id: 'qwer',
      time: 'asdf'
    };

    client.saveTime$('a-time')
      .subscribe((activity) => expect(activity).toBe(saved));

    httpMock.expectOne({
      method: 'POST',
      url: 'http://monserveur.com/_times',
      body: {time: 'a-time'}
    }).flush(saved);

  }));
});
