import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpCheckboxComponent } from './cmp-checkbox.component';

describe('CmpCheckboxComponent', () => {
  let component: CmpCheckboxComponent;
  let fixture: ComponentFixture<CmpCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
