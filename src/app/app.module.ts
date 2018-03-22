import { HttpClientModule }          from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule }             from '@angular/platform-browser';
import { NgbModule }                 from '@ng-bootstrap/ng-bootstrap';
import { AppConfig }                 from '../environments/appconfig';
import { AppNavbarComponent }        from './app-navbar/app-navbar.component';
import { AppRoutingModule }          from './app-routing.module';
import { AppComponent }              from './app.component';
import { BucDetailComponent }        from './buc-detail/buc-detail.component';
import { BucsComponent }               from './bucs/bucs.component';
import { EessiFagmodulBackendService } from './eessi-fagmodul-backend.service';
import { HomeComponent }               from './home/home.component';
import { IsaliveComponent }            from './isalive/isalive.component';
import { SedDetailComponent }          from './sed-detail/sed-detail.component';
import { SedsComponent }               from './seds/seds.component';
import { SelftestComponent }           from './selftest/selftest.component';
import { SummaryComponent }            from './summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    BucsComponent,
    BucDetailComponent,
    SummaryComponent,
    SedsComponent,
    SedDetailComponent,
    AppNavbarComponent,
    SelftestComponent,
    IsaliveComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ AppConfig ], multi: true },
    EessiFagmodulBackendService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

export function initConfig(config: AppConfig) {
  return () => config.load();
}
