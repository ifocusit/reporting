import { TestBed, inject } from '@angular/core/testing';

import { TimesClientService } from './times-client.service';

describe('TimesClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimesClientService],
    });
  });

  it('should be created', inject([TimesClientService], (service: TimesClientService) => {
    expect(service).toBeTruthy();
  }));
});
