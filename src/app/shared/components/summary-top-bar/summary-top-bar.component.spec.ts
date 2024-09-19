import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTopBarComponent } from './summary-top-bar.component';

describe('SummaryTopBarComponent', () => {
  let component: SummaryTopBarComponent;
  let fixture: ComponentFixture<SummaryTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryTopBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
