import { TestBed } from '@angular/core/testing';

import { PsiAgGridService } from './psi-ag-grid.service';

describe('PsiAgGridService', () => {
  let service: PsiAgGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsiAgGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
