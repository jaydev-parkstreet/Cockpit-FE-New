import { ComponentFixture, TestBed } from '@angular/core/testing';

import { summaryComponent } from './summary.component';

describe('summaryComponent', () => {
  let component: summaryComponent;
  let fixture: ComponentFixture<summaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ summaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(summaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
