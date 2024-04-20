import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { addHours } from 'date-fns';

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
import { ClinicAssigmentService } from 'src/app/pages/clinic-assignment/services/clinic-assigment.service';

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
  private readonly clinicService = inject(ClinicService);
  private readonly clinicAssignment = inject(ClinicAssigmentService);
  public confirmDocumentForm!: FormGroup;
  public newAppointmentForm!: FormGroup;
  public patient!: Account;
  public userLogged!: string;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';

  public clinicList: Clinic[] = [];
  public doctorList!: Account[];

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
    this.clinicService.allClinicsAvailable().subscribe(({ clinics }) => {
      this.clinicList = clinics;
    });
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
  get clinic() {
    return this.newAppointmentForm.get('clinic');
  }

  get doctor() {
    return this.newAppointmentForm.get('doctor');
  }

  getDoctorsAssigned() {
    this.clinicAssignment
      .allDoctorsAssingedToClinic(this.newAppointmentForm.get('clinic')?.value)
      .subscribe({
        next: (doctors) => {
          this.doctorList = doctors;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  isDocumentNumberCorrect() {
    if (this.confirmDocumentForm.valid) {
      this.accountService
        .confirmDocumentNumber(this.confirmDocumentForm.value.document)
        .subscribe({
          next: (patient) => {
            this.patient = patient;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  createAppointment() {
    if (this.newAppointmentForm.value) {
      const { start, clinic, doctor, time } = this.newAppointmentForm.value;
      const appointmentForm = {
        startDate: addHours(new Date(start), parseInt(time)).toISOString(),
        endDate: addHours(new Date(start), parseInt(time) + 1).toISOString(),
        clinicId: clinic as string,
        doctorId: doctor as string,
        patientId: this.patient?.id,
        createdBy: this.userLogged,
      };
      this.appointmentService.createNewAppointment(appointmentForm).subscribe({
        next: () => {
          this.newAppointmentForm.reset();
          this.confirmDocumentForm.reset();
          this.dialogRef.close();
          success('Appointment has created success');
          this.store.dispatch(ui.isLoadingTable());
        },
        error: (err) => {
          console.log(err)
          error('Error while creating appointment')
        },
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
