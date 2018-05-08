import { HttpClientModule }                 from "@angular/common/http";
import { APP_INITIALIZER }                  from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule }              from "@angular/router/testing";
import { AppConfig }                        from '../../environments/appconfig';
import { EessiFagmodulBackendService }      from '../eessi-fagmodul-backend.service';

import { HomeComponent } from './home.component';

function initConfig(config: AppConfig) {
    return () => config.appConfig = {
        'eessiFagmodulUrl': ''
    };
}

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [
                RouterTestingModule,
                HttpClientModule
            ],
            providers: [
                AppConfig,
                {provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true},
                EessiFagmodulBackendService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
