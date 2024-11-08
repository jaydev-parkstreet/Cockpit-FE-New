import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpInputDropdownComponent } from './cmp-input-dropdown.component';

describe('CmpInputDropdownComponent', () => {
  let component: CmpInputDropdownComponent;
  let fixture: ComponentFixture<CmpInputDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpInputDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpInputDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
