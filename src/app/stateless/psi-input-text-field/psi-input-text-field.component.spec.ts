import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiInputTextFieldComponent } from './psi-input-text-field.component';

describe('PsiInputTextFieldComponent', () => {
  let component: PsiInputTextFieldComponent;
  let fixture: ComponentFixture<PsiInputTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiInputTextFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiInputTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
