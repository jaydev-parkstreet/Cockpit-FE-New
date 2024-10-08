import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiActionButtonsComponent } from './psi-action-buttons.component';

describe('PsiActionButtonsComponent', () => {
  let component: PsiActionButtonsComponent;
  let fixture: ComponentFixture<PsiActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiActionButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
