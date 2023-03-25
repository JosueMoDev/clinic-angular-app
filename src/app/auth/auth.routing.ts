import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/patient', component:LoginComponent, data: { title: 'login/patient'} },
    { path: 'register/patient', component:PatientRegisterComponent},  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
    
export class AuthRoutingModule {}
