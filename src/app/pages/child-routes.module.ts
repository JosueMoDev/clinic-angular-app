import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//* Components
import { ClinicsComponent } from './clinics/clinics.component';
import { AppointmentComponent } from './appointments/appointments.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { authorizedAccountGuard } from '../authentication/guards';
import { Role } from '../authentication/interfaces';
import { AccountsComponent } from './accounts/accounts.component';

const childRoutes: Routes = [
  {
    path: 'calendar',
    component: AppointmentComponent,
    data: { title: 'Calendar' },
  },
  {
    path: 'medical-record',
    component: MedicalRecordComponent,
    canActivate: [authorizedAccountGuard],
    data: {
      title: 'Medical Record',
      allowedRoles: [Role.ADMIN, Role.PATIENT, Role.DOCTOR],
    },
  },
  {
    path: 'show-user',
    component: ShowUserComponent,
    data: { title: 'User Profile' },
  },
  {
    path: 'show-clinic',
    component: ShowClinicComponent,
    data: { title: 'Clinic Profile' },
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authorizedAccountGuard],
    data: { title: 'Accounts', allowedRoles: [Role.ADMIN] },
  },
  {
    path: 'clinics',
    component: ClinicsComponent,
    // canActivate: [AuthorizeUserGuard],
    // data: { title: 'Clinics', allowedRoles: [Rol.ADMIN] }
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
