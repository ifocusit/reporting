import { TestBed, inject } from '@angular/core/testing';

import { TimbrageStorageService } from './timbrage-storage.service';

describe('TimbrageStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimbrageStorageService]
    });
  });

  it('should be created', inject([TimbrageStorageService], (service: TimbrageStorageService) => {
    expect(service).toBeTruthy();
  }));
});
