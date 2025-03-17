import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiBrandModalComponent } from './psi-brand-modal.component';

describe('PsiBrandModalComponent', () => {
  let component: PsiBrandModalComponent;
  let fixture: ComponentFixture<PsiBrandModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiBrandModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiBrandModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
