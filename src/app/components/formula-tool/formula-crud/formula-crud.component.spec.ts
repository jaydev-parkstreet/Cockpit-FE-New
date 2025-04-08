import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormulaCrudComponent } from './formula-crud.component';

describe('FormulaCrudComponent', () => {
    let component: FormulaCrudComponent;
    let fixture: ComponentFixture<FormulaCrudComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FormulaCrudComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormulaCrudComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});