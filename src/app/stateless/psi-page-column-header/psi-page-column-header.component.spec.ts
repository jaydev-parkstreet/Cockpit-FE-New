import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiPageColumnHeaderComponent } from './psi-page-column-header.component';

describe('PsiPageColumnHeaderComponent', () => {
  let component: PsiPageColumnHeaderComponent;
  let fixture: ComponentFixture<PsiPageColumnHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiPageColumnHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiPageColumnHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
