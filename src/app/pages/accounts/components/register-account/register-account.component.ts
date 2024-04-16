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
  styleUrl: './register-account.component.css',
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
  private readonly accountService = inject(AccountsService);
  private readonly formBuilder = inject(FormBuilder);
  public hide = true;
  public registerForm: FormGroup =  this.formBuilder.group(
      {
        duiNumber: [null, Validators.required],
        email: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
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
        password: [null, [Validators.required, Validators.minLength(9)]],
        confirmationPassword: [null, [Validators.required, Validators.minLength(9)]],
      },
      { validators: this.passwordMatchValidator }
    );
    

  constructor(
    private store: Store<AppState>,
    public matdialogRef: MatDialogRef<RegisterAccountComponent>
  ) {
    
  }

  createAccount() {
    const { confirmationPassword, ...rest } = this.registerForm.value;
    if (this.registerForm.valid) {
      this.accountService.crearteNewAccount(rest).subscribe({
        next: () => {
          success('Account save correctly');
          this.store.dispatch(ui.isLoadingTable());
          this.registerForm.reset();
          this.matdialogRef.close();
        },
        error: () => error('Account not save'),
      });
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

  get password() {
    return this.registerForm.get('password');
  }
  get confirmationPassword() {
    return this.registerForm.get('confirmationPassword');
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmationPassword = control.get('confirmationPassword')?.value;
    return password === confirmationPassword ? null : { passwordMismatch: control.value };
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

