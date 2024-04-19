import { Component, inject} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {addHours} from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';



import { error, success } from 'src/app/helpers/sweetAlert.helper';
import { DoctorAvailable } from 'src/app/interfaces/doctors-available.interface';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { AppointmentService } from '../../services/appoinment.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AccountsService } from 'src/app/pages/accounts/services/accounts.service';
import { Account } from 'src/app/models/account.model';
import { ClinicService } from 'src/app/pages/clinics/services/clinic.service';
import { Clinic } from 'src/app/models/clinic.model';


@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styles: [],
  standalone: true,
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
})
export class CreateAppointmentComponent {
  private readonly appointmentService = inject(AppointmentService);
  private readonly accountService = inject(AccountsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly clinicService = inject(ClinicService)
  public confirmDocumentForm!: FormGroup;
  public newAppointmentForm!: FormGroup;
  public patient!: Account;
  public userLogged!: string;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';

  public clinicList: Clinic[] = [];
  public doctorList!: DoctorAvailable[];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<CreateAppointmentComponent>
  ) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
    this.maxDate = new Date(currentYear, currentMonth + 3, currentDay);
  }

  ngOnInit(): void {
    this.userLogged = this.authenticationService.currentUserLogged()!.id;
    this.confirmDocumentForm = this.formBuilder.group({
      document: ['', [Validators.required, Validators.minLength(9)]],
    });

    this.newAppointmentForm = this.formBuilder.group({
      clinic: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      start: [null, [Validators.required]],
      time: ['', [Validators.required]],
    });

    this.getAllClinicAvilable();

  }

  getAllClinicAvilable() {
    this.clinicService.allClinicsAvailable()
      .subscribe(({ clinics }) => {
          console.log(clinics)
          this.clinicList = clinics
        }
      )
  }



  get clinics() {
    return this.clinicList;
  }
  get patientByDocumentNumber() {
    return this.newAppointmentForm.patchValue({ title: this.completename });
  }
  get document_number() {
    return this.confirmDocumentForm.get('document');
  }
  get completename() {
    return this.patient?.name + ' ' + this.patient?.lastname;
  }
  get clinicId() {
    return this.newAppointmentForm.get('clinic')?.value;
  }

  
  getDoctorsAssigned() {
    console.log(this.newAppointmentForm.get('clinic')?.value);
  }

  isDocumentNumberCorrect() {
    if (this.confirmDocumentForm.valid) {
      this.accountService.confirmDocumentNumber(this.confirmDocumentForm.value.document).subscribe({
        next: (patient) => {
          this.patient = patient;
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  createAppointment() {
    // if (!this.newAppointmentForm.invalid && this.patient?.id) {
    //   const { start, clinic, doctor, time } = this.newAppointmentForm.value;
    //   const appointmentForm = {
    //     start: addHours(new Date(start), parseInt(time)),
    //     end: addHours(new Date(start), parseInt(time) + 1),
    //     title: this.completename,
    //     clinic,
    //     doctor,
    //     patient: this.patient?.id,
    //     createdby: this.userLogged,
    //   };
    //   this.appointmentService.createNewAppointment(appointmentForm).subscribe(
    //     (resp: any) => {
    //       if (resp.ok) {
    //         this.isDocument_numberCorrenct = false;
    //         this.newAppointmentForm.reset();
    //         this.confirmDocumentForm.reset();
    //         this.dialogRef.close();
    //         success(resp.message);
    //         this.store.dispatch(ui.isLoadingTable());
    //       }
    //     },
    //     (err: any) => {
    //       error(err.error.message);
    //     }
    //   );
    // }
  }

  close(): void {
    this.dialogRef.close();
  }
}
