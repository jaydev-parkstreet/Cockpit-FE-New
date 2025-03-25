import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiUploadFilesComponent } from './psi-upload-files.component';

describe('PsiUploadFilesComponent', () => {
  let component: PsiUploadFilesComponent;
  let fixture: ComponentFixture<PsiUploadFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsiUploadFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsiUploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
