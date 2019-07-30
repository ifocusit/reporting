import { TestBed } from '@angular/core/testing';

import { CommonsService } from './commons.service';

describe('CommonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonsService = TestBed.get(CommonsService);
    expect(service).toBeTruthy();
  });
});
