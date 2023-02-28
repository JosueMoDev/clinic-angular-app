import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material.module';




@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule
  ], exports: [
    LoginComponent,
  ]
})
export class AuthModule { }
