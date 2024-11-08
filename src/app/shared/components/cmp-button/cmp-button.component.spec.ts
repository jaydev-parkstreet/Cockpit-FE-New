import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpButtonComponent } from './cmp-button.component';

describe('CmpButtonComponent', () => {
  let component: CmpButtonComponent;
  let fixture: ComponentFixture<CmpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
