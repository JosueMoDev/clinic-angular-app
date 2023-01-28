import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//* Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { Error404Component } from './error404/error404.component';
 
 const routes: Routes = [
    {
        path: 'dashboard', component: PagesComponent,
        children: [
          { path: '', component: DashboardComponent },
          { path: 'medical-record', component: MedicalRecordComponent },
          {path: '**', component: Error404Component}
        ]
    },
    
 ];
 
 @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
 })
 export class PagesRoutingModule {}
 