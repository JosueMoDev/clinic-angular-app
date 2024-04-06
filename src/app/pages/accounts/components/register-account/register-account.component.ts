import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  standalone: true,
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [],
})
export class RegisterAccountComponent {
  public formSubmitted: boolean = false;
  public registerForm!: FormGroup;
  private readonly accountService = inject(AccountsService);

  

  constructor(
    private formbuilder: FormBuilder,
    private store: Store<AppState>,
    public matdialogRef: MatDialogRef<RegisterAccountComponent>
  ) {}

  ngOnInit() {
    this.registerForm = this.formbuilder.group({
      duiNumber: [null, Validators.required],
      email: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(25),
          this.forbiddenInputMailValidator(),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          this.forbiddenInputTextValidator(),
        ],
      ],
      lastname: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          this.forbiddenInputTextValidator(),
        ],
      ],
      phone: [null, Validators.required],
      gender: [null, Validators.required],
      role: [null, Validators.required],
      password: ['123456789']
    });
  }
  
  createAccount() {
    console.log(this.registerForm.valid)
    if (this.registerForm.valid) {
      
      this.accountService
        .crearteNewAccount(this.registerForm.value)
        .subscribe(
          async (resp: any) => {
          
           success(resp.message);
           this.store.dispatch(ui.isLoadingTable());
           this.registerForm.reset();
           this.matdialogRef.close(); 
          },
          (err) => error(err.error.message)
        );
    }
  }

  get duiNumber() {
    return this.registerForm.get('duiNumber');
  }
  get name() {
    return this.registerForm.get('name');
  }
  get lastname() {
    return this.registerForm.get('lastname');
  }
  get email() {
    return this.registerForm.get('email');
  }
 
  get phone() {
    return this.registerForm.get('phone');
  }

  forbiddenInputTextValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z\s]+[a-zA-Z]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }
}
