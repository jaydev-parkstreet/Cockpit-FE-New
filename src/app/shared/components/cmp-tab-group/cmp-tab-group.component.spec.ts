import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpTabGroupComponent } from './cmp-tab-group.component';

describe('CmpTabGroupComponent', () => {
  let component: CmpTabGroupComponent;
  let fixture: ComponentFixture<CmpTabGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpTabGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
