import { TestBed } from '@angular/core/testing';

import { HouseCashCredits } from './house-cash-credits';

describe('HouseCashCredits', () => {
  let service: HouseCashCredits;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseCashCredits);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
