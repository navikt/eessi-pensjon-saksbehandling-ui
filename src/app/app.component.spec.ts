import { APP_BASE_HREF }      from '@angular/common';
import { async, TestBed }     from '@angular/core/testing';
import { NgbModule }          from '@ng-bootstrap/ng-bootstrap';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { AppRoutingModule }   from './app-routing.module';
import { AppComponent }       from './app.component';
import { HomeComponent }      from './home/home.component';
import { IsaliveComponent }   from './isalive/isalive.component';
import { SelftestComponent }  from './selftest/selftest.component';
import { SummaryComponent }   from './summary/summary.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule,
                AppRoutingModule,
            ],
            declarations: [
                AppComponent,
                AppNavbarComponent,
                HomeComponent,
                SelftestComponent,
                SummaryComponent,
                IsaliveComponent
            ],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'}
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'EESSI Fagmodul'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('EESSI Fagmodul');
    }));

    it('should render the router-outlet tag', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('router-outlet')).toBeTruthy();
    }));
});
