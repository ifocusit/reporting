import { TestBed, inject } from '@angular/core/testing';

import { ActivityServiceService } from './activity-service.service';

describe('ActivityClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityServiceService]
    });
  });

  it('should be created', inject([ActivityServiceService], (service: ActivityServiceService) => {
    expect(service).toBeTruthy();
  }));
});
