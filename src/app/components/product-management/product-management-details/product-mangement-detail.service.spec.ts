import { TestBed } from '@angular/core/testing';

import { ProductMangementDetailService } from './product-mangement-detail.service';

describe('ProductMangementDetailService', () => {
  let service: ProductMangementDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMangementDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
