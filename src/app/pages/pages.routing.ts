import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//* Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
 
 const routes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'medical-record', component: MedicalRecordComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          
          
        ]
    },
    
 ];
 
 @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
 })
 export class PagesRoutingModule {}
 