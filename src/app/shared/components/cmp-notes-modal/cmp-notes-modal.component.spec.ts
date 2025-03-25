import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpNotesModalComponent } from './cmp-notes-modal.component';

describe('CmpNotesModalComponent', () => {
  let component: CmpNotesModalComponent;
  let fixture: ComponentFixture<CmpNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpNotesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
