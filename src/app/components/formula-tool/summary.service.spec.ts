import { TestBed } from '@angular/core/testing';

import { formulaService } from './summary.service';

describe('formulaService', () => {
  let service: formulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(formulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
