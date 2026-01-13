import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolHeader } from './tool-header';

describe('ToolHeader', () => {
  let component: ToolHeader;
  let fixture: ComponentFixture<ToolHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
