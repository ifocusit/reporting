import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ActivityClient} from './activity-client.service';
import {TEST_DATA_MARS} from "../model/activities-data.spec";
import {environment} from "../../environments/environment";
import {Activity, ActivityType} from "../model/activity.model";

describe('ActivityClient', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivityClient]
    });

    environment.api = 'http://monserveur.com';
  });

  it('should be created', inject([ActivityClient, HttpTestingController], (client, htppMock) => {
    expect(client).toBeTruthy();
    expect(htppMock).toBeTruthy();
  }));

  it('should call backend on getActivities', inject([ActivityClient, HttpTestingController], (client, httpMock) => {
    client.getActivities$('UN_MOIS')
      .subscribe((activities) => expect(activities).toBe(TEST_DATA_MARS));

    httpMock.expectOne({
      method: 'GET',
      url: 'http://monserveur.com/activities/month/UN_MOIS'
    }).flush(TEST_DATA_MARS);
  }));

  it('should call backend on saveActivity', inject([ActivityClient, HttpTestingController], (client, httpMock) => {

    const savedActivitiy = <Activity>{
      id: 'qwer',
      date: 'asdf',
      duration: 'yxcv',
      type: ActivityType.OFF
    };

    client.saveActivity$('a-date', 'a-duration', ActivityType.OFF)
      .subscribe((activity) => expect(activity).toBe(savedActivitiy));

    httpMock.expectOne({
      method: 'POST',
      url: 'http://monserveur.com/activities',
      body: {date: 'a-date', duration: 'a-duration', type: ActivityType.OFF}
    }).flush(savedActivitiy);

  }));
});
