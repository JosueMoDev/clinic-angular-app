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
import { error, success } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAssigmentService } from 'src/app/pages/clinic-assignment/services/clinic-assigment.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ClinicService } from 'src/app/pages/clinics/services/clinic.service';
import { AppointmentService } from '../../services/appoinment.service';
import { Clinic } from 'src/app/models/clinic.model';
import { Account } from 'src/app/models/account.model';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrl:'./edit-appointment.component.css',
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

  public editAppointmentForm!: FormGroup;
  public userLogged!: string;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';
  public dataAppointment!: Appointment;
  public clinicList: Clinic[] = [];
  public doctorList: Account[] = [];
  public somethingChanged: boolean = false;

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
    const today = new Date(this.dataAppointment.start);
    const appointmentTime = today.getHours() + ':' + today.getMinutes();
    this.userLogged = this.authenticationService.currentUserLogged()!.id;

    this.doctorSelected = this.dataAppointment.doctor;
    this.doctorSelectedName = this.dataAppointment.doctor;

    this.editAppointmentForm = this.formBuilder.group({
      clinic: [this.dataAppointment.clinic, [Validators.required]],
      doctor: [this.doctorSelected, [Validators.required]],
      start: [this.dataAppointment.start, [Validators.required]],
      time: [appointmentTime, [Validators.required]],
    });

  }
 
  get hasChanges() {
    return this.somethingChanged;
  }

  get clinic() {
    return this.editAppointmentForm.get('clinic')
  }
  get doctor() {
    return this.editAppointmentForm.get('doctor')
  }
  get newDate() {
    const date = setHours(
      new Date(this.editAppointmentForm.get('start')?.value),
      0
    );
    return date;
  }

  get newTime() {
    return this.editAppointmentForm.get('time')?.value;
  }

  editAppointment() {
    if (!this.editAppointmentForm.invalid) {
      this.editAppointmentForm.get('doctor')?.enable();
      const { clinic, doctor } = this.editAppointmentForm.value;
      const appointmentEditForm = {
        start: addHours(new Date(this.newDate), parseInt(this.newTime)),
        end: addHours(new Date(this.newDate), parseInt(this.newTime) + 1),
        clinic,
        doctor,
      };
      this.appointmentService
        .editAppointment(this.dataAppointment.id, appointmentEditForm)
        .subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.editAppointmentForm.reset();
              this.dialogRef.close();
              success(resp.message);
              this.store.dispatch(ui.isLoadingTable());
            }
          },
          (err: any) => {
            error(err.error.message);
          }
        );
    }
  }

  deleteAppointment() {
    this.appointmentService
      .deleteAppointment(this.dataAppointment.id, this.userLogged)
      .subscribe(
        (resp: any) => {
          if (resp.ok) {
            this.dialogRef.close();
            success(resp.message);
            this.store.dispatch(ui.isLoadingTable());
          }
        },
        (err: any) => {
          error(err.error.message);
        }
      );
  }

  close(): void {
    this.dialogRef.close();
  }
}
