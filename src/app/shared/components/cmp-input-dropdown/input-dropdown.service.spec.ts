import { TestBed } from '@angular/core/testing';

import { InputDropdownService } from './input-dropdown.service';

describe('InputDropdownService', () => {
  let service: InputDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
