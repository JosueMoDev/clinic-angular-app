import { Component, inject, Inject } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';

import Swal from 'sweetalert2';


import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Account } from 'src/app/models/account.model';
import { ChangePasswordComponent } from '../accounts/components';
import { AccountsService } from '../accounts/services/accounts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { Router } from '@angular/router';
   



@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.css',
})
export class ShowAccountComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly accountService = inject(AccountsService);
  private formbuilder = inject(FormBuilder);
  public snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public currentUserLogged!: Account;
  public formSub$!: Subscription;
  public isLoading: boolean = false;
  public profileSelected!: Account;
  public ShowPassWordButtom: boolean = false;
  public somethingChanged: boolean = false;
  //? User Information
  public document_type: string = 'DUI';
  public updateForm!: FormGroup;

  // ? User Photo
  public currectPhoto!: string | undefined;
  public imagenTemp!: any;
  public updatePhotoForm!: FormGroup;
  constructor(public matDialog: MatDialog) {}
  public file!: File;

  ngOnInit() {
    this.profileSelected = this.accountService.selectedAccount() as Account;
    this.currentUserLogged =
      this.authenticationService.currentUserLogged() as Account;
    this.updateForm = this.formbuilder.group({
      duiNumber: [this.profileSelected.duiNumber, Validators.required],
      email: [
        this.profileSelected.email,
        [
          Validators.required,
          Validators.minLength(10),
          this.forbiddenInputMailValidator(),
        ],
      ],
      name: [
        this.profileSelected.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          this.forbiddenInputTextValidator(),
        ],
      ],
      lastname: [
        this.profileSelected.lastname,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          this.forbiddenInputTextValidator(),
        ],
      ],
      phone: [this.profileSelected.phone, Validators.required],
      gender: [this.profileSelected.gender, Validators.required],
    });

    this.updatePhotoForm = this.formbuilder.group({
      file: [''],
    });

    if (this.profileSelected.role !== 'ADMIN') {
      this.updateForm.disable();
    }

    this.ShowPassWordButtom =
      this.currentUserLogged.id === this.profileSelected.id;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('account-selected');
  }

  updateAccount() {
    if (this.updateForm.valid) {
      const { gender, ...rest } = this.updateForm.value;
      this.accountService
        .updateAccount({
          gender: gender.toLowerCase(),
          ...rest,
          id: this.profileSelected.id,
        })
        .subscribe({
          next: () => {
            this.snackBar.openFromComponent(SnackbarComponent, {
              duration: 2000,
              data: {
                message: 'Account successfuly updated',
                isSuccess: true,
              },
            });
          },
          error: ({ error }) => {
            this.snackBar.openFromComponent(SnackbarComponent, {
              duration: 2000,
              data: {
                message: error.error,
                isSuccess: false,
              },
            });
          },
        });
    }
  }

  deletePhoto() {
    this.accountService.deletePhoto(this.profileSelected.id).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          duration: 2000,
          data: {
            message: 'Photo Deleted',
            isSuccess: true,
          },
        });
        this.router.navigateByUrl('/dashboard/accounts');
      },
      error: ({ error }) => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          duration: 2000,
          data: {
            message: error.error,
            isSuccess: false,
          },
        });
      },
    });
  }
  uploadPhoto() {
    if (this.updatePhotoForm.valid) {
      this.accountService
        .uploadPhoto(this.profileSelected.id, this.file)
        .subscribe({
          next: () => {
            this.snackBar.openFromComponent(SnackbarComponent, {
              duration: 2000,
              data: {
                message: 'Photo uploaded',
                isSuccess: true,
              },
            });
            this.router.navigateByUrl('/dashboard/accounts');
          },
          error: ({ error }) => {
             this.snackBar.openFromComponent(SnackbarComponent, {
               duration: 2000,
               data: {
                 message: error.error,
                 isSuccess: false,
               },
             });
          },
        });
    }
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  get name() {
    return this.updateForm.get('name');
  }
  get lastname() {
    return this.updateForm.get('lastname');
  }
  get email() {
    return this.updateForm.get('email');
  }
  get duiNumber() {
    return this.updateForm.get('duiNumber');
  }
  get phone() {
    return this.updateForm.get('phone');
  }

  get hasChanges() {
    return this.somethingChanged;
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
  openDialog(): void {
    this.matDialog.open(ChangePasswordComponent, {
      width: '30%',
      height: 'auto',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  }
}
