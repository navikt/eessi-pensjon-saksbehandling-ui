import { inject, TestBed } from '@angular/core/testing';

import { BucService } from './buc.service';

describe('BucService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BucService]
        });
    });

    it('should be created', inject([BucService], (service: BucService) => {
        expect(service).toBeTruthy();
    }));
});
