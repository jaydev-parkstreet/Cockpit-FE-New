import { ComponentFixture, TestBed } from '@angular/core/testing';

import { formulaComponent } from './summary.component';

describe('formulaComponent', () => {
  let component: formulaComponent;
  let fixture: ComponentFixture<formulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ formulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(formulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
