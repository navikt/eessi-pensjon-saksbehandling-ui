import { HttpClientModule }                 from '@angular/common/http';
import { APP_INITIALIZER }                  from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfig }                        from '../../environments/appconfig';
import { EessiFagmodulBackendService }      from '../eessi-fagmodul-backend.service';
import { SelftestComponent }                from './selftest.component';

function initConfig(config: AppConfig) {
    return () => config.appConfig = {
        'eessiFagmodulUrl': ''
    };
}

describe('SelftestComponent', () => {
    let component: SelftestComponent;
    let fixture: ComponentFixture<SelftestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelftestComponent
            ],
            imports: [
                HttpClientModule
            ],
            providers: [
                AppConfig,
                {provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true},
                EessiFagmodulBackendService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelftestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
