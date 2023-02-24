import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { Error404Component } from './pages/error404/error404.component';
const routes: Routes = [
  { path:'', redirectTo:'/dashboard/main', pathMatch:'full'},
  { path: '**', component:Error404Component}


  
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
