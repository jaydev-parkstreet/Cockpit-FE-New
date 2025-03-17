import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiCrudFormComponent } from './psi-crud-form.component';

describe('PsiCrudFormComponent', () => {
  let component: PsiCrudFormComponent;
  let fixture: ComponentFixture<PsiCrudFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiCrudFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiCrudFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
