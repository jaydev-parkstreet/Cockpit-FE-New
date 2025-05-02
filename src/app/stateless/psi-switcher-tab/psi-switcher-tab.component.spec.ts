import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiSwitcherTabComponent } from './psi-switcher-tab.component';

describe('PsiSwitcherTabComponent', () => {
  let component: PsiSwitcherTabComponent;
  let fixture: ComponentFixture<PsiSwitcherTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiSwitcherTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiSwitcherTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
