import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER }  from '@angular/core';
import { inject, TestBed }  from '@angular/core/testing';
import { AppConfig }        from '../environments/appconfig';


import { EessiFagmodulBackendService } from './eessi-fagmodul-backend.service';

function initConfig(config: AppConfig) {
  return () => config.appConfig = {
    'eessiFagmodulUrl': ''
  };
}

describe('EessiFagmodulBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        AppConfig,
        { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ AppConfig ], multi: true },
        EessiFagmodulBackendService
      ]
    });
  });

  it('should be created', inject([ EessiFagmodulBackendService ], (service: EessiFagmodulBackendService) => {
    expect(service).toBeTruthy();
  }));
});
