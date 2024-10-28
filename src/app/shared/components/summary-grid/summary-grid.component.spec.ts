import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryGridComponent } from './summary-grid.component';

describe('SummaryGridComponent', () => {
  let component: SummaryGridComponent;
  let fixture: ComponentFixture<SummaryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
