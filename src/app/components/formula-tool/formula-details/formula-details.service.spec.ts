import { TestBed } from '@angular/core/testing';

import { formulaDetailService } from './formula-details.service';

describe('formulaDetailService', () => {
  let service: formulaDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(formulaDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
