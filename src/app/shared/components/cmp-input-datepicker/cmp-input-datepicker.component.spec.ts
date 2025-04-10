import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpInputDatepickerComponent } from './cmp-input-datepicker.component';

describe('CmpInputDatepickerComponent', () => {
  let component: CmpInputDatepickerComponent;
  let fixture: ComponentFixture<CmpInputDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpInputDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpInputDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
