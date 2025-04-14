import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsiStepProgressBarComponent } from './psi-step-progress-bar.component';

describe('PsiStepProgressBarComponent', () => {
    let component: PsiStepProgressBarComponent;
    let fixture: ComponentFixture<PsiStepProgressBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PsiStepProgressBarComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PsiStepProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
