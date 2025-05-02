import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiRadioButtonComponent } from './psi-radio-button.component';

describe('PsiRadioButtonComponent', () => {
  let component: PsiRadioButtonComponent;
  let fixture: ComponentFixture<PsiRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PsiRadioButtonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
