import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { addHours, setHours } from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { AppoinmentService } from 'src/app/services/appoinment.service';
import { ClinicService } from 'src/app/services/clinic.service';

import { Clinic } from 'src/app/models/clinic.model';

import { Appointment } from 'src/app/models/appointment.model';
import { error, success } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAssignmentsService } from 'src/app/services/clinic-assignments.service';

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
  public clinicList: Clinic[] = []
  public doctorList: any[] | undefined
  public someChange: boolean = false;

  public doctorSelected!: string | null;
  public doctorSelectedName!: string;

  constructor(
    private appointmentService: AppoinmentService,
    private authService: AuthService,
    private clinicService: ClinicService,
    private clinicAssignment: ClinicAssignmentsService,
    private formBuilder: FormBuilder,
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
    const appointmentTime = today.getHours() + ':' + today.getMinutes();
    this.userLogged = this.authService.currentUserLogged.id;
    
    this.doctorSelected = this.dataAppointment.doctor
    this.doctorSelectedName = this.dataAppointment.doctor_info;

    this.editAppointmentForm = this.formBuilder.group({
      clinic: [this.dataAppointment.clinic, [Validators.required]],
      doctor: [this.doctorSelected, [Validators.required]],
      start: [this.dataAppointment.start, [Validators.required]],
      time:[ appointmentTime ,[Validators.required]]
    });
    this.allClinics();
    this.somethigChange
  }
  ngOnDestroy(): void {
    this.somethigChange.unsubscribe
  }

  allClinics() {
    //! Refactory
    console.warn('refactor at allClinicForAppointments, ActionsAppointmentDialogComponent');
    // this.clinicAssignment.allEmployeesAssingedToClinic(this.dataAppointment.clinic)
    //   .subscribe(
    //     (resp:any) => {
    //       this.clinicList = resp.clinics;
    //       this.clinics
    //     }
    //   )
  }

  get doctor() {
    this.doctorSelected = ''
    this.editAppointmentForm.patchValue({ 'doctor': '' });
    if (this.editAppointmentForm.get('doctor')?.value) {
      return this.doctorSelectedName
    }
    this.editAppointmentForm.get('doctor')?.enable();
    return this.doctorSelectedName = 'Select a doctor';
  }

  get somethigChange() {
    return this.editAppointmentForm.statusChanges.subscribe(value => {
      if (value === 'VALID') { this.someChange = true }
      else { this.someChange = false}
    })
  }


  get clinics() { return this.clinicList  }
  get clinicId() { return this.editAppointmentForm.get('clinic')?.value; }
  get doctorsByClinicId() {
    // this.editAppointmentForm.get('doctor')?.disable();
    // const clinicSelected = this.clinicList.filter(clinic => clinic.clinic_id === this.clinicId);
    // if (clinicSelected[0].doctors_assigned!.length>=1) {
    //   this.editAppointmentForm.get('doctor')?.enable();
    //   this.doctorList = clinicSelected[0].doctors_assigned
    //   this.doctor
    //   return this.doctorList;
    // }
    // this.doctor
    // return this.doctorList = [];
    return
  }
  get newDate() {
    const date = setHours(new Date(this.editAppointmentForm.get('start')?.value), 0)
    return date
  }

  get newTime() { return this.editAppointmentForm.get('time')?.value; }

  editAppointment() {
    if (!this.editAppointmentForm.invalid) {
      this.editAppointmentForm.get('doctor')?.enable()
      const { clinic, doctor } = this.editAppointmentForm.value;
      const appointmentEditForm = {
        start: addHours( new Date(this.newDate), parseInt(this.newTime)),
        end: addHours( new Date(this.newDate), parseInt(this.newTime)+1),
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
