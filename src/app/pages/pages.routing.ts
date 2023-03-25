import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/guards/auth.guard';

//* Components
import { CalendarComponent } from 'src/app/shared/calendar/calendar.component';
import { ClinicsComponent } from './clinics/clinics.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PagesComponent } from './pages.component';
import { PatientsComponent } from './patients/patients.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { UsersComponent } from './users/users.component';
 
 const routes: Routes = [
    {
        path: 'dashboard', component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'main', component: DashboardComponent, data: { title: 'Dasboard'} },
          { path: 'medical-record', component: MedicalRecordComponent, data: { title: 'Medical Record' } },
          { path: 'show-user', component: ShowUserComponent, data: { title: 'User Profile' } },
          { path: 'show-clinic', component: ShowClinicComponent, data: { title: 'Clinic Profile'} },
          { path: 'patients', component: PatientsComponent, data: { title: 'Patients' } },
          { path: 'clinics', component: ClinicsComponent, data: { title: 'Clinics'} },
          { path: 'calendar', component: CalendarComponent, data: { title: 'Calendar' } },
          { path: 'users', component:UsersComponent, data: { title: 'Users'} },
          {path: '**', component: Error404Component}
        ]
    },
    
 ];
 
 @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
 })
 export class PagesRoutingModule {}
 