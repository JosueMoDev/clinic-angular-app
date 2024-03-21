import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesRoutingModule } from 'src/app/pages/pages.routing';

import { Error404Component } from 'src/app/pages/error404/error404.component';
import { AuthenticationModule } from './authentication/authentication.module';

const routes: Routes = [
  { path:'', redirectTo:'/dashboard/calendar', pathMatch:'full'},
  { path: '**', component:Error404Component }
]

@NgModule({
  declarations: [],
  imports: [
    AuthenticationModule,
    PagesRoutingModule,
    RouterModule.forRoot(routes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
