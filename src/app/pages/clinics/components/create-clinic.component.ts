import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ClinicService } from '../services/clinic.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Account } from 'src/app/models/account.model';




 
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
  public formSub$!: Subscription;
  public currentStep: number = 1;
  public registerClinicForm!: FormGroup;
  public isFirstStepValid: boolean = false;
  public provinces!: string[];
  public cities!: string[];
  public loggedUser!: Account;
  public imagenTemp!: any;
  private readonly clinicService = inject(ClinicService);
  private readonly authenticationService= inject(AuthenticationService);

  constructor(
    private formbuilder: FormBuilder,
    public matdialogRef: MatDialogRef<CreateClinicComponent>,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loggedUser = this.authenticationService.currentUserLogged() as Account;

    this.registerClinicForm = this.formbuilder.group({
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
    });
  }

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
    console.log(this.registerClinicForm.value);
    this.clinicService.createClinic(this.registerClinicForm.value).subscribe(
      async (resp: any) => {
        success(resp.message);
        this.store.dispatch(ui.isLoadingTable());
        this.matdialogRef.close();
        this.registerClinicForm.reset();
      },
      (err) => error(err.error.message)
    );
  }
}
