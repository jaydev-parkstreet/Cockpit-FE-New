import { TestBed } from '@angular/core/testing';

import { CmpInputDatepickerServiceService } from './cmp-input-datepicker-service.service';

describe('CmpInputDatepickerServiceService', () => {
  let service: CmpInputDatepickerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmpInputDatepickerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
