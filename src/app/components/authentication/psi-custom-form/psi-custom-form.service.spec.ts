import { TestBed } from '@angular/core/testing';

import { PsiCustomFormService } from './psi-custom-form.service';

describe('PsiCustomFormService', () => {
  let service: PsiCustomFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsiCustomFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
