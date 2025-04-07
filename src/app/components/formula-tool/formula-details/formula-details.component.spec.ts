import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaDetailsComponent } from './formula-details.component';

describe('FormulaDetailsComponent', () => {
  let component: FormulaDetailsComponent;
  let fixture: ComponentFixture<FormulaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
