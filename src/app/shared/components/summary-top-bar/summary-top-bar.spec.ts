import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTopBar } from './summary-top-bar';

describe('SummaryTopBar', () => {
  let component: SummaryTopBar;
  let fixture: ComponentFixture<SummaryTopBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryTopBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryTopBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
