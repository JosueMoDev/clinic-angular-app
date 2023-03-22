import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

//* Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PagesComponent } from './pages.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { PatientsComponent } from './patients/patients.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { UsersComponent } from './users/users.component';
import { RegisterClinicComponent } from './components/register-clinic/register-clinic.component';
import { ClinicsComponent } from './clinics/clinics.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { AppointmentDialogComponent } from './components/appointment-dialog/appointment-dialog.component';
import { ActionsAppointmentDialogComponent } from './components/actions-appointment-selected/actions-appointment-dialog.component';






@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    Error404Component,
    MedicalRecordComponent,
    ShowUserComponent,
    PatientsComponent,
    UserRegisterComponent,
    UsersComponent,
    RegisterClinicComponent,
    ClinicsComponent,
    ShowClinicComponent,
    PasswordRecoveryComponent,
    AppointmentDialogComponent,
    ActionsAppointmentDialogComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    Error404Component,
    UserRegisterComponent
  ],
  providers:[provideNgxMask()]
})
export class PagesModule { }
