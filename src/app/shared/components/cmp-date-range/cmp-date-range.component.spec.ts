import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpDateRangeComponent } from './cmp-date-range.component';

describe('CmpDateRangeComponent', () => {
  let component: CmpDateRangeComponent;
  let fixture: ComponentFixture<CmpDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpDateRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
