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
import { ClinicsComponent } from './clinics/clinics.component';
import { AppointmentComponent } from './appointments/appointments.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PagesComponent } from './pages.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';
import { ShowAccountComponent } from './show-account/show-account.component';
import { NewMedialRecordComponent } from './components/new-medial-record/new-medial-record.component';
import { EditMedicalRecordComponent } from './components/edit-medical-record/edit-medical-record.component';
import { SearchingComponent } from './components/searching/searching.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ClinicAssignmentComponent } from './clinic-assignment/clinic-assignment.component';


@NgModule({
  declarations: [
    AccountsComponent,
    ActionsAppointmentDialogComponent,
    ClinicAssignmentComponent,
    ClinicsComponent,
    AppointmentComponent,
    Error404Component,
    MedicalRecordComponent,
    PagesComponent,
    ShowClinicComponent,
    ShowAccountComponent,
    NewMedialRecordComponent,
    EditMedicalRecordComponent,
    SearchingComponent,
    
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
    AppointmentComponent,
    Error404Component,
    PagesComponent,
  ],
  providers:[provideNgxMask()]
})
  
export class PagesModule { }
