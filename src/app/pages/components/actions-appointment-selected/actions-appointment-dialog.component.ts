import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { addHours, setHours } from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { AppointmentService } from 'src/app/services/appointment.service';

import { Appointment } from 'src/app/models/appointment.model';
import { error, success } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAssigmentService } from 'src/app/pages/clinic-assignment/services/clinic-assigment.service';
import { ClinicAvailableToMakeAnAppointment } from 'src/app/interfaces/clinic-available.interface';
import { DoctorAvailable } from 'src/app/interfaces/doctors-available.interface';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { ClinicService } from '../../clinics/services/clinic.service';

@Component({
  selector: 'app-actions-appointment-selected',
  templateUrl: './actions-appointment-dialog.component.html',
  styles: [
  ]
})
export class ActionsAppointmentDialogComponent {
  public formSub$!: Subscription;
  public editAppointmentForm!: FormGroup;
  public userLogged!: string;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';
  public dataAppointment!: Appointment; 
  public clinicList: ClinicAvailableToMakeAnAppointment[] = [];
  public doctorList!: DoctorAvailable[];
  public somethingChanged: boolean = false;

  public doctorSelected!: string | null;
  public doctorSelectedName!: string;
  private readonly authenticationService = inject(AuthenticationService);

  constructor(
    private appointmentService: AppointmentService,
    private clinicService: ClinicService,
    private clinicAssignment: ClinicAssigmentService,
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
    const today = new Date(this.dataAppointment.startDate);
    const appointmentTime = today.getHours() + ':' + today.getMinutes();
    this.userLogged = this.authenticationService.currentUserLogged()?.id as any;
    
    this.doctorSelected = this.dataAppointment.doctorId
    this.doctorSelectedName = this.dataAppointment.doctorId;

    this.editAppointmentForm = this.formBuilder.group({
      // clinic: [this.dataAppointment.clinic, [Validators.required]],
      doctor: [this.doctorSelected, [Validators.required]],
      start: [this.dataAppointment.startDate, [Validators.required]],
      time:[ appointmentTime ,[Validators.required]]
    });
    this.allClinicsAvailableToMakeAnAppointment();
    this.doctorsByClinicId;
    
    this.formSub$ = this.editAppointmentForm.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        this.somethingChanged = true;
        this.hasChanges;
      }
      else {
        this.somethingChanged = false;
        this.hasChanges;
      }
    })

  }
  ngOnDestroy(): void {
    this.formSub$.unsubscribe
  }

  allClinicsAvailableToMakeAnAppointment() {
    this.clinicService.allClinicsAvailableToMakeAnAppointment()
      .subscribe(({ clinics }) => {
          this.clinicList = clinics
        }
      )
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

  get hasChanges() {return this.somethingChanged}


  get clinics() { return this.clinicList  }
  get clinicId() { return this.editAppointmentForm.get('clinic')?.value; }
  get doctorsByClinicId() {
    this.clinicAssignment.allDoctorsAvailableToMakeAnAppointment(this.editAppointmentForm.get('clinic')?.value)
    //   .subscribe(
    //     ({ doctors }: any)=>{
    //       this.doctorList = doctors;
    //   }
    // )
    return this.doctorList;
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
      this.appointmentService.editAppointment( this.dataAppointment.id, appointmentEditForm).subscribe(
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
    this.appointmentService.deleteAppointment( this.dataAppointment.id, this.userLogged).subscribe(
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
