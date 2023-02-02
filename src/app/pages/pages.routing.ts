import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//* Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { Error404Component } from './error404/error404.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CalendarComponent } from '../shared/calendar/calendar.component';
 
 const routes: Routes = [
    {
        path: 'dashboard', component: PagesComponent,
        children: [
           { path: '', component: DashboardComponent, data: { title: 'Dasboard'} },
          { path: 'medical-record', component: MedicalRecordComponent, data: { title: 'Medical Record'} },
          { path: 'user-profile', component: UserProfileComponent, data: { title: 'User Profile'} },
          { path: 'calendar', component: CalendarComponent, data: { title: 'Calendar'} },
          

          {path: '**', component: Error404Component}
        ]
    },
    
 ];
 
 @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
 })
 export class PagesRoutingModule {}
 