import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagementDetailsComponent } from './product-management-details.component';

describe('ProductManagementDetailsComponent', () => {
  let component: ProductManagementDetailsComponent;
  let fixture: ComponentFixture<ProductManagementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductManagementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManagementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
