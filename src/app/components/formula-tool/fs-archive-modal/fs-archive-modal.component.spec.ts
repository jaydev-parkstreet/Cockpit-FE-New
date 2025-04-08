import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsArchiveModalComponent } from './fs-archive-modal.component';

describe('FsArchiveModalComponent', () => {
  let component: FsArchiveModalComponent;
  let fixture: ComponentFixture<FsArchiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FsArchiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FsArchiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
