import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLayoutDetailsComponent } from './card-layout-details.component';

describe('CardLayoutDetailsComponent', () => {
  let component: CardLayoutDetailsComponent;
  let fixture: ComponentFixture<CardLayoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardLayoutDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
