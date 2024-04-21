import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { addHours, setHours } from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { Appointment } from 'src/app/models/appointment.model';
import { ClinicAssigmentService } from 'src/app/pages/clinic-assignment/services/clinic-assigment.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ClinicService } from 'src/app/pages/clinics/services/clinic.service';
import { AppointmentService } from '../../services/appoinment.service';
import { Clinic } from 'src/app/models/clinic.model';
import { Account } from 'src/app/models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.css',
  standalone: true,
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  styles: [],
})
export class EditAppointmentComponent {
  private readonly appointmentService = inject(AppointmentService);
  private readonly clinicService = inject(ClinicService);
  private readonly clinicAssignment = inject(ClinicAssigmentService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly store = inject(Store<AppState>);
  public snackBar = inject(MatSnackBar);

  public editAppointmentForm!: FormGroup;
  public userLogged!: string;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';
  public dataAppointment!: Appointment;
  public clinicList: Clinic[] = [];
  public doctorList: Account[] = [];

  public doctorSelected!: string | null;
  public doctorSelectedName!: string;

  constructor(
    public dialogRef: MatDialogRef<EditAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
    this.maxDate = new Date(currentYear, currentMonth + 3, currentDay);
  }

  ngOnInit(): void {
    this.dataAppointment = { ...this.data };
    this.userLogged = this.authenticationService.currentUserLogged()!.id;
    this.doctorSelected = this.dataAppointment.doctor;
    this.doctorSelectedName = this.dataAppointment.doctor;


    this.editAppointmentForm = this.formBuilder.group({
      clinic: [this.dataAppointment.clinic, [Validators.required]],
      doctor: [this.doctorSelected, [Validators.required]],
      start: [new Date(this.dataAppointment.start), [Validators.required]],
      time: [
        `${this.dataAppointment.start.getHours()}:00`,
        [Validators.required],
      ],
    });
  }

  get clinic() {
    return this.editAppointmentForm.get('clinic');
  }
  get doctor() {
    return this.editAppointmentForm.get('doctor');
  }
 

  editAppointment() {
    if (!this.editAppointmentForm.invalid) {
      this.editAppointmentForm.get('doctor')?.enable();
      const { clinic, doctor, start, time } = this.editAppointmentForm.value;
      // TODO: debemos corregir fechas
      const appointmentEditForm = {
        startDate: addHours(new Date(start), parseInt(time)).toISOString(),
        endDate: addHours(new Date(start), parseInt(time) + 1).toISOString(),
        clinicId: clinic,
        doctorId: doctor,
        patientId: this.dataAppointment.patient,
        id: this.dataAppointment.id,
        lastUpdate: {
          account: this.userLogged,
        },
      };
      this.appointmentService.editAppointment(appointmentEditForm).subscribe({
        next: () => {
          this.editAppointmentForm.reset();
          this.dialogRef.close();
          this.store.dispatch(ui.isLoadingTable());
          this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: {
              message: 'Appointment has updated success',
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

  deleteAppointment() {
    this.appointmentService
      .deleteAppointment(this.dataAppointment.id)
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.store.dispatch(ui.isLoadingTable());
          this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: {
              message: 'Appointment has deleted success',
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
