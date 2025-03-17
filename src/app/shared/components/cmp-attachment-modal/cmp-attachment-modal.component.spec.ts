import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpAttachmentModalComponent } from './cmp-attachment-modal.component';

describe('CmpAttachmentModalComponent', () => {
  let component: CmpAttachmentModalComponent;
  let fixture: ComponentFixture<CmpAttachmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpAttachmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpAttachmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
