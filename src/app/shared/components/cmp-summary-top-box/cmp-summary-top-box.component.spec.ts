import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpSummaryTopBoxComponent } from './cmp-summary-top-box.component';

describe('CmpSummaryTopBoxComponent', () => {
    let component: CmpSummaryTopBoxComponent;
    let fixture: ComponentFixture<CmpSummaryTopBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CmpSummaryTopBoxComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CmpSummaryTopBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
