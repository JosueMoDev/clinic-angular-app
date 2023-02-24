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
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RegisterComponent } from './users/register.component';
import { PatientsComponent } from './patients/patients.component';
import { StepperComponent } from './components/stepper/stepper.component';





@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    Error404Component,
    MedicalRecordComponent,
    PorcentageCardComponent,
    UserProfileComponent,
    RegisterComponent,
    StepperComponent,
    PatientsComponent
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
    Error404Component
  ],
  providers:[provideNgxMask()]
})
export class PagesModule { }
