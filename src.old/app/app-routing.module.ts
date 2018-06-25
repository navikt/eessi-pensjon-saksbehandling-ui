import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }        from './home/home.component';
import { IsaliveComponent }     from './isalive/isalive.component';
import { SelftestComponent }    from './selftest/selftest.component';
import { SummaryComponent }     from './summary/summary.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'selftest', component: SelftestComponent},
    {path: 'summary', component: SummaryComponent},
    {path: 'internal/selftest', component: SelftestComponent},
    {path: 'internal/isalive', component: IsaliveComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            onSameUrlNavigation: 'reload'
        }),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

