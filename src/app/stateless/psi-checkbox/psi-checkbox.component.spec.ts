import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiCheckboxComponent } from './psi-checkbox.component';

describe('PsiCheckboxComponent', () => {
  let component: PsiCheckboxComponent;
  let fixture: ComponentFixture<PsiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
