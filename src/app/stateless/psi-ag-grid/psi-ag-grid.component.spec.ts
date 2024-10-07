import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiAgGridComponent } from './psi-ag-grid.component';

describe('PsiAgGridComponent', () => {
  let component: PsiAgGridComponent;
  let fixture: ComponentFixture<PsiAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiAgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
