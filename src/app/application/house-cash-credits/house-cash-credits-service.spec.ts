import { TestBed } from '@angular/core/testing';

import { HouseCashCreditsService } from './house-cash-credits-service';

describe('HouseCashCreditsService', () => {
  let service: HouseCashCreditsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseCashCreditsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
