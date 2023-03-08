import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogModule} from '@angular/cdk/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    DialogModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AngularMaterialModule { }
