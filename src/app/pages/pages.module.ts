import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


//* Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PagesComponent } from './pages.component';
import { PorcentageCardComponent } from './components/porcentage-card/porcentage-card.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { PatientsComponent } from './patients/patients.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ModalUserRegisterComponent } from './components/modal-user-register/modal-user-register.component';
import { UsersComponent } from './users/users.component';
import { RegisterClinicComponent } from './components/register-clinic/register-clinic.component';
import { ClinicsComponent } from './clinics/clinics.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';






@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    Error404Component,
    MedicalRecordComponent,
    PorcentageCardComponent,
    ShowUserComponent,
    StepperComponent,
    PatientsComponent,
    ModalUserRegisterComponent,
    UsersComponent,
    RegisterClinicComponent,
    ClinicsComponent,
    ShowClinicComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaskDirective,
    NgxMaskPipe
  
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    Error404Component,
    ModalUserRegisterComponent
  ],
  providers:[provideNgxMask()]
})
export class PagesModule { }
