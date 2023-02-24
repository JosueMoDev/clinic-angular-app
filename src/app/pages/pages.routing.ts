import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//* Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { Error404Component } from './error404/error404.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { PatientsComponent } from './patients/patients.component';

import { RegisterComponent } from './users/register.component';
import { ClinicsComponent } from './components/clinics/clinics.component';
 
 const routes: Routes = [
    {
        path: 'dashboard', component: PagesComponent,
        children: [
          { path: 'main', component: DashboardComponent, data: { title: 'Dasboard'} },
          { path: 'medical-record', component: MedicalRecordComponent, data: { title: 'Medical Record' } },
          { path: 'user-profile', component: UserProfileComponent, data: { title: 'User Profile'} },
          { path: 'patients', component: PatientsComponent, data: { title: 'Patients' } },
          { path: 'clinics', component: ClinicsComponent, data: { title: 'Clinics'} },
          { path: 'calendar', component: CalendarComponent, data: { title: 'Calendar' } },
          { path: 'register', component:RegisterComponent, data: { title: 'Register'} },
          
          

          {path: '**', component: Error404Component}
        ]
    },
    
 ];
 
 @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
 })
 export class PagesRoutingModule {}
 