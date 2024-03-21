import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http'
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './components';





@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [LoginComponent],
  declarations: [LoginComponent],
  providers:[provideNgxMask()]
  
})
export class AuthenticationModule { }
