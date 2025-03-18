import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiEmptyMessageComponent } from './psi-empty-message.component';

describe('PsiEmptyMessageComponent', () => {
  let component: PsiEmptyMessageComponent;
  let fixture: ComponentFixture<PsiEmptyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiEmptyMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiEmptyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
