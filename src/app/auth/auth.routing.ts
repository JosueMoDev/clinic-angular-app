import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { Error403Component } from './error403/error403.component';
import { LoginComponent } from '../authentication/login/login.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/patient', component:LoginComponent, data: { title: 'login/patient'} },
    { path: 'register/patient', component: PatientRegisterComponent }, 
    { path: 'forbidden', component: Error403Component }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
    
export class AuthRoutingModule {}
