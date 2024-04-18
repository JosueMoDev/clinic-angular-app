import { Component, inject } from '@angular/core';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import Swal from 'sweetalert2';

import { Clinic } from 'src/app/models/clinic.model';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Subscription } from 'rxjs';
import { ClinicService } from '../clinics/services/clinic.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { Account } from 'src/app/models/account.model';

@Component({
  selector: 'app-show-clinic',
  templateUrl: './show-clinic.component.html',
  styles: [],
})
export class ShowClinicComponent {
  private readonly clinicService = inject(ClinicService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly formbuilder = inject(FormBuilder);
  public authenticatedAccount!: string;
  public clinicSelected!: Clinic;
  public formSub$!: Subscription;
  public updateForm!: FormGroup;
  public uploadPhotoForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.clinicSelected = this.clinicService.selectedClinic() as Clinic;
    this.authenticatedAccount = this.authenticationService.currentUserLogged()!.id;
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

    this.uploadPhotoForm = this.formbuilder.group({
      photoUrl: [this.clinicSelected.photoUrl, Validators.required],
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('clinic-selected');
    this.formSub$.unsubscribe;
  }

  updateCLinic() {
    if (this.updateForm.valid) {
      const { address, ...rest } = this.updateForm.value;
      this.clinicService
        .updateClinic({ id: this.clinicSelected.id, address, ...rest, lastUpdate:{ account: this.authenticatedAccount } })
        .subscribe({
          next: () => {
            success('Clinic Update Success');
          },
          error: (err) => {
            error('Ocurrio un error');
            console.log(err);
          },
        });
    }
  }

  deletePhoto() {}

  uploadPhoto() {}

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
