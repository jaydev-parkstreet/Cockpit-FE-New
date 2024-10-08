import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsDefaultLinkComponent } from './ps-default-link.component';

describe('PsDefaultLinkComponent', () => {
  let component: PsDefaultLinkComponent;
  let fixture: ComponentFixture<PsDefaultLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsDefaultLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsDefaultLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
