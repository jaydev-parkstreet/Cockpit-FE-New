import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpHeaderWidgetComponent } from './cmp-header-widget.component';

describe('CmpHeaderWidgetComponent', () => {
  let component: CmpHeaderWidgetComponent;
  let fixture: ComponentFixture<CmpHeaderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpHeaderWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpHeaderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
