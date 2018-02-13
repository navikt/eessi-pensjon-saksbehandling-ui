import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { NgbModule }          from '@ng-bootstrap/ng-bootstrap';
import { AppComponent }       from './app.component';
import { BucDetailComponent } from './buc-detail/buc-detail.component';
import { BucsComponent }      from './bucs/bucs.component';
import { SummaryComponent }   from './summary/summary.component';
import { SedsComponent }      from './seds/seds.component';
import { SedDetailComponent } from './sed-detail/sed-detail.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { AppRoutingModule } from './/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    BucsComponent,
    BucDetailComponent,
    SummaryComponent,
    SedsComponent,
    SedDetailComponent,
    AppNavbarComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
