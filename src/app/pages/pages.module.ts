import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';


//* Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PagesComponent } from './pages.component';
import { PorcentageCardComponent } from './components/porcentage-card/porcentage-card.component';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    Error404Component,
    MedicalRecordComponent,
    PorcentageCardComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    Error404Component
  ]
})
export class PagesModule { }
