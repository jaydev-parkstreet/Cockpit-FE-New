import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSummaryDimensionsCardComponent } from './product-summary-dimensions-card.component';

describe('ProductSummaryDimensionsCardComponent', () => {
  let component: ProductSummaryDimensionsCardComponent;
  let fixture: ComponentFixture<ProductSummaryDimensionsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSummaryDimensionsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSummaryDimensionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
