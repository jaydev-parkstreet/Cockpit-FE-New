import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassUploadExcelModalComponent } from './mass-upload-excel-modal.component';

describe('MassUploadExcelModalComponent', () => {
  let component: MassUploadExcelModalComponent;
  let fixture: ComponentFixture<MassUploadExcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassUploadExcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassUploadExcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
