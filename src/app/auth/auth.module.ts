import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material.module';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';




@NgModule({
  declarations: [
    LoginComponent,
    PatientRegisterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    NgxMaskDirective,
    NgxMaskPipe
  ], exports: [
    LoginComponent,
  ],
  providers:[provideNgxMask()]
  
})
export class AuthModule { }
