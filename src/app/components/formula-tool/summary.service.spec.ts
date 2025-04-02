import { TestBed } from '@angular/core/testing';

import { summaryService } from './summary.service';

describe('summaryService', () => {
  let service: summaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(summaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
