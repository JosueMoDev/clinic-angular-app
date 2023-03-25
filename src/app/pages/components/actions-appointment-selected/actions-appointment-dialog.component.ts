import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { addHours } from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { AppoinmentService } from 'src/app/services/appoinment.service';

import { Appointment } from 'src/app/models/appointment.model';
import { error, success } from 'src/app/helpers/sweetAlert.helper';

@Component({
  selector: 'app-actions-appointment-selected',
  templateUrl: './actions-appointment-dialog.component.html',
  styles: [
  ]
})
export class ActionsAppointmentDialogComponent {
  public editAppointmentForm!: FormGroup;
  public userLogged!: string;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';
  public dataAppointment!: Appointment;  
  
  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppoinmentService,
    private authService: AuthService,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<ActionsAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment,
  ) { 
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    this.minDate = new Date(currentYear , currentMonth, currentDay);
    this.maxDate = new Date(currentYear, currentMonth + 3, currentDay);

  }

  ngOnInit(): void {
    this.dataAppointment = { ...this.data };
    const today = new Date(this.dataAppointment.start);
    const appointmentTime = today.getHours()+':'+today.getMinutes()
    this.userLogged = this.authService.currentUserLogged.id;
     
    this.editAppointmentForm = this.formBuilder.group({
      clinic: [this.dataAppointment.clinic, [Validators.required]],
      doctor: [this.dataAppointment.doctor, [Validators.required]],
      start: [this.dataAppointment.start, [Validators.required]],
      time:[ appointmentTime ,[Validators.required]]
    });
  }

  editAppointment() {
    if (!this.editAppointmentForm.invalid) {
      const { start, clinic, doctor, time } = this.editAppointmentForm.value;
       const appointmentEditForm = {
        start: addHours( new Date(start), parseInt(time)),
        end: addHours( new Date(start), parseInt(time)+1),
        clinic,
        doctor,
      }
      this.appointmentService.editAppointment( this.dataAppointment.appointment_id, appointmentEditForm).subscribe(
        (resp: any)=>{
          if (resp.ok) {
            this.editAppointmentForm.reset();
            this.dialogRef.close();
            success(resp.message);
            this.store.dispatch(ui.isLoadingTable())
          }
        },
        (err: any) => {
          error(err.error.message)
        }
      )
    } 
  }

  deleteAppointment() {
    this.appointmentService.deleteAppointment( this.dataAppointment.appointment_id, this.userLogged).subscribe(
      (resp: any)=>{
        if (resp.ok) {
          this.dialogRef.close();
          success(resp.message);
          this.store.dispatch(ui.isLoadingTable())
        }
      },
      (err: any) => {
        error(err.error.message)
      }
    )
  }

  close(): void {
    this.dialogRef.close();
  }
}
