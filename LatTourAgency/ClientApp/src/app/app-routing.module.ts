import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { LoginComponent } from 'src/api-authorization/login/login.component';
import { CounterComponent } from './counter/counter.component';
import { CrudHotelComponent } from './crud-hotel/crud-hotel.component';
import { CrudTownComponent } from './crud-town/crud-town.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './register/register.component';
import { CrudTourComponent } from './Tour/crud-tour/crud-tour.component';

import { TourListComponent } from './Tour/Tour-List/Tour-List.component';

const routes: Routes = [

    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, pathMatch: 'full' },
    { path: 'login-page', component: LoginPageComponent, pathMatch: 'full' },

    { path: 'counter', component: CounterComponent },
    { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard] },
    {path: 'tour',component:TourListComponent},
    {path:'crud-tour',component:CrudTourComponent,pathMatch:'full'},
    {path:'crud-hotel',component:CrudHotelComponent,pathMatch:'full'},
    {path:'crud-town',component:CrudTownComponent,pathMatch:'full'},
    



];

@NgModule({
    imports: [RouterModule.forRoot(routes,{ relativeLinkResolution: 'legacy',  scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})

export class AppRoutingModule { }