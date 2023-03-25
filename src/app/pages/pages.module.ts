import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

//* Components
import { ActionsAppointmentDialogComponent } from './components/actions-appointment-selected/actions-appointment-dialog.component';
import { AppointmentDialogComponent } from './components/appointment-dialog/appointment-dialog.component';
import { ClinicAssigmentComponent } from './components/clinic-assigment/clinic-assigment.component';
import { ClinicAssigmentDialogComponent } from './components/clinic-assigment-dialog/clinic-assigment-dialog.component';
import { ClinicsComponent } from './clinics/clinics.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PagesComponent } from './pages.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PatientsComponent } from './patients/patients.component';
import { RegisterClinicComponent } from './components/register-clinic/register-clinic.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    ActionsAppointmentDialogComponent,
    AppointmentDialogComponent,
    ClinicAssigmentComponent,
    ClinicAssigmentDialogComponent,
    ClinicsComponent,
    DashboardComponent,
    Error404Component,
    MedicalRecordComponent,
    PagesComponent,
    PasswordRecoveryComponent,
    PatientsComponent,
    RegisterClinicComponent,
    ShowClinicComponent,
    ShowUserComponent,
    UserRegisterComponent,
    UsersComponent
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    SharedModule
  
  ],
  exports: [
    DashboardComponent,
    Error404Component,
    PagesComponent,
    UserRegisterComponent
  ],
  providers:[provideNgxMask()]
})
  
export class PagesModule { }
