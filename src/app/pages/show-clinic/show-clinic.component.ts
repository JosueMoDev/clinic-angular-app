import { Component, inject } from '@angular/core';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { Clinic } from 'src/app/models/clinic.model';

import { Subscription } from 'rxjs';
import { ClinicService } from '../clinics/services/clinic.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-clinic',
  templateUrl: './show-clinic.component.html',
  styles: [],
})
export class ShowClinicComponent {
  private readonly clinicService = inject(ClinicService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly formbuilder = inject(FormBuilder);
  public snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public authenticatedAccount!: string;
  public clinicSelected!: Clinic;
  public updateForm!: FormGroup;
  public uploadPhotoForm!: FormGroup;
  public file!: File;

  constructor() {}

  ngOnInit() {
    this.clinicSelected = this.clinicService.selectedClinic() as Clinic;
    this.authenticatedAccount =
    this.authenticationService.currentUserLogged()!.id;
    this.updateForm = this.formbuilder.group({
      registerNumber: [this.clinicSelected.registerNumber, Validators.required],
      name: [
        this.clinicSelected.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      phone: [this.clinicSelected.phone, Validators.required],
      address: this.formbuilder.group({
        state: [this.clinicSelected.address.state, [Validators.required]],
        city: [this.clinicSelected.address.city, Validators.required],
        street: [this.clinicSelected.address.street, Validators.required],
      }),
    });

    this.uploadPhotoForm = this.formbuilder.group({ file: [this.clinicSelected.photoUrl],
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('clinic-selected');
  }

  updateCLinic() {
    if (this.updateForm.valid) {
      const { address, ...rest } = this.updateForm.value;
      this.clinicService
        .updateClinic({
          id: this.clinicSelected.id,
          address,
          ...rest,
          lastUpdate: { account: this.authenticatedAccount },
        })
        .subscribe({
          next: () => {
            this.snackBar.openFromComponent(SnackbarComponent, {
              duration: 2000,
              data: {
                message: 'Clinic has been updated',
                isSuccess: false,
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
    this.clinicService.deletePhoto(this.clinicSelected.id, this.authenticatedAccount).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          duration: 2000,
          data: {
            message: 'Photo Deleted',
            isSuccess: true,
          },
        });
        this.router.navigateByUrl('/dashboard/clinics');
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
    if (this.updateForm.valid) {
      this.clinicService
        .uploadPhoto(this.clinicSelected.id, this.file)
        .subscribe({
          next: () => {
            this.snackBar.openFromComponent(SnackbarComponent, {
              duration: 2000,
              data: {
                message: 'Photo uploaded',
                isSuccess: true,
              },
            });
            this.router.navigateByUrl('/dashboard/clinics');
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
  get registerNumber() {
    return this.updateForm.get('registerNumber');
  }
  get phone_number() {
    return this.updateForm.get('phone');
  }
  get state() {
    return this.updateForm.get('address.state');
  }
  get city() {
    return this.updateForm.get('address.city');
  }
  get street() {
    return this.updateForm.get('address.street');
  }

  forbiddenInputTextValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }
}
