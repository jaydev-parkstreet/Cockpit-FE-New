import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsDetailsComponent } from './ps-details.component';

describe('PsDetailsComponent', () => {
  let component: PsDetailsComponent;
  let fixture: ComponentFixture<PsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
