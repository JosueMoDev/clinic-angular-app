import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { AccountsService } from '../../services/accounts.service';
import { Account } from 'src/app/models/account.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private authenticationService = inject(AuthenticationService);
  private accountService = inject(AccountsService);
  private formbuilder = inject(FormBuilder);
  public changePasswordForm: FormGroup = this.formbuilder.group({
    oldPassword: [null, [Validators.required, Validators.minLength(8)]],
    newPassword: [null, [Validators.required, Validators.minLength(8)]],
    confirmationPassword: [
      null,
      [Validators.required, Validators.minLength(8)],
    ],
  });
  public hide = true;
  public account: string = this.accountService.selectedAccount()!.id;
  public currentUserLogged: Account =
    this.authenticationService.currentUserLogged() as Account;

  constructor(public matdialogRef: MatDialogRef<ChangePasswordComponent>) {}

  
  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }
  get confirmationPassword() {
    return this.changePasswordForm.get('confirmationPassword');
  }
  get hasPasswordMatch() {
    return (
      this.changePasswordForm.get('newPassword')?.value ===
      this.changePasswordForm.get('confirmationPassword')?.value
    );
  }

  passwordRecoveryForm() {
    if (this.hasPasswordMatch) {
      const {  confirmationPassword, ...rest} = this.changePasswordForm.value;
      this.accountService
        .changePassword({ ...rest, account: this.account })
        .subscribe({
          next: () => {
            this.changePasswordForm.reset();
            this.matdialogRef.close();
            success('Password has changed successful');
          },
          error: () => {
            error('Ocurrio un problema');
          },
        });
    }
  }
}