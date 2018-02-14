import { TestBed, inject } from '@angular/core/testing';

import { EessiFagmodulBackendService } from './eessi-fagmodul-backend.service';

describe('EessiFagmodulBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EessiFagmodulBackendService]
    });
  });

  it('should be created', inject([EessiFagmodulBackendService], (service: EessiFagmodulBackendService) => {
    expect(service).toBeTruthy();
  }));
});
