import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ActivityClient } from './activity-client.service';

describe('ActivityClient', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivityClient]
    });
  });

  it('should be created', inject([ActivityClient], (service: ActivityClient) => {
    expect(service).toBeTruthy();
  }));
});
