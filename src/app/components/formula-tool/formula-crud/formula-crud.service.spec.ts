import { TestBed } from '@angular/core/testing';
import { FormulaCrudService } from './formula-crud.service';

describe('FormulaCrudService', () => {
    let service: FormulaCrudService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormulaCrudService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});