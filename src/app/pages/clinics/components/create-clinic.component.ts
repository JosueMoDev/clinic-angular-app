import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Account } from 'src/app/models/account.model';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppState } from 'src/app/app.reducer';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { ClinicService } from '../services/clinic.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import * as ui from 'src/app/store/actions/ui.actions';
 
@Component({
  selector: 'app-create-clinic',
  standalone: true,
  styleUrl: './create-clinic.component.css',
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './create-clinic.component.html',
  styles: [],
})
export class CreateClinicComponent {
  private readonly clinicService = inject(ClinicService);
  private readonly authenticationService= inject(AuthenticationService);
  private formbuilder = inject(FormBuilder);
  private store = inject(Store<AppState>);

  public formSub$!: Subscription;
  public loggedUser: Account  = this.authenticationService.currentUserLogged() as Account;;
  public registerClinicForm: FormGroup =  this.formbuilder.group({
      registerNumber: ['', Validators.required],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],

      phone: ['', Validators.required],
      address: this.formbuilder.group({
        state: ['', [Validators.required]],
        city: ['', Validators.required],
        street: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
      }),
      createdBy: [this.loggedUser.id],
    });;

  constructor(
    public matdialogRef: MatDialogRef<CreateClinicComponent>,
  ) {}

  ngOnDestroy(): void {
    this.formSub$.unsubscribe;
  }

  get photo() {
    return this.registerClinicForm.get('photo')?.value;
  }
  get name() {
    return this.registerClinicForm.get('name');
  }

  get registerNumber() {
    return this.registerClinicForm.get('registerNumber');
  }
  get phone() {
    return this.registerClinicForm.get('phone');
  }
  get state() {
    return this.registerClinicForm.get('address.state');
  }
  get city() {
    return this.registerClinicForm.get('address.city');
  }
  get street() {
    return this.registerClinicForm.get('address.street');
  }

  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9]+[\sa-zA-Z0-9]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  createClinic() {
    this.clinicService.createClinic(this.registerClinicForm.value).subscribe({
      next: () => {
         success('Clinic Created success');
         this.store.dispatch(ui.isLoadingTable());
         this.matdialogRef.close();
         this.registerClinicForm.reset();
      },
      error: () => {  error('An Errors happend while we were creating clinic')}
    });
  }
}