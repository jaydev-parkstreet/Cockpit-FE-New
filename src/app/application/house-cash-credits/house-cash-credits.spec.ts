import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseCashCredits } from './house-cash-credits';

describe('HouseCashCredits', () => {
  let component: HouseCashCredits;
  let fixture: ComponentFixture<HouseCashCredits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseCashCredits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseCashCredits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
