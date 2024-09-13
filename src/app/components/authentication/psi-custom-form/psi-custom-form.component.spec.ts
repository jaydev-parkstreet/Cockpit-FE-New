import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiCustomFormComponent } from './psi-custom-form.component';

describe('PsiCustomFormComponent', () => {
  let component: PsiCustomFormComponent;
  let fixture: ComponentFixture<PsiCustomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiCustomFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiCustomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
