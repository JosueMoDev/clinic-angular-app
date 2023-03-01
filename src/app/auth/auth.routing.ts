import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../pages/users/register.component';



const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/patient', component:LoginComponent, data: { title: 'login/patient'} },
    { path: 'register/patient', component:RegisterComponent, data: { title: 'register/patient'} },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
