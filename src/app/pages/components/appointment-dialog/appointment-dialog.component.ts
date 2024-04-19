import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {addHours} from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';



import { error, success } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAvailableToMakeAnAppointment } from '../../../interfaces/clinic-available.interface';
import { DoctorAvailable } from 'src/app/interfaces/doctors-available.interface';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ClinicService } from '../../clinics/services/clinic.service';
import { ClinicAssigmentService } from 'src/app/pages/clinic-assignment/services/clinic-assigment.service';
import { AppointmentService } from '../../appointments/services/appoinment.service';


@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styles: []
})
export class AppointmentDialogComponent {
  public confirmPatientForm!: FormGroup;
  public newAppointmentForm!: FormGroup;
  public patient!: any
  public userLogged!: string;
  public isDocument_numberCorrenct: boolean = false;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';

  public clinicList: ClinicAvailableToMakeAnAppointment[] = []
  public doctorList!: DoctorAvailable[];

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthenticationService,
    private store: Store<AppState>,
    private clinicService: ClinicService,
    private clinicAssignment: ClinicAssigmentService,
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
  ) { 
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    this.minDate = new Date(currentYear , currentMonth, currentDay);
    this.maxDate = new Date(currentYear, currentMonth + 3, currentDay );
  }

  ngOnInit(): void {
    this.userLogged = this.authService.currentUserLogged()?.id as any;
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['', [Validators.required, Validators.minLength(9)]]
    });
    
    this.newAppointmentForm = this.formBuilder.group({
      clinic: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      start: [null, [Validators.required]],
      time:['',[Validators.required]]
    });
    this.allClinicsAvailableToMakeAnAppointment();
    this.newAppointmentForm.get('doctor')?.disable()
  }


  allClinicsAvailableToMakeAnAppointment() {
    this.clinicService.allClinicsAvailableToMakeAnAppointment()
      .subscribe(({ clinics }) => {
          this.clinicList = clinics
        }
      )
  }
  get clinics() { return this.clinicList;  }
  get patientByDocumentNumber() { return this.newAppointmentForm.patchValue({ 'title': this.completename }); }
  get document_number() { return this.confirmPatientForm.get('document_number'); }
  get completename() { return this.patient?.name + ' ' + this.patient?.lastname; }
  get clinicId() { return (this.newAppointmentForm.get('clinic')?.value); }
  
  get doctorsByClinicId() {
    this.newAppointmentForm.get('doctor')?.disable();
    this.clinicAssignment.allDoctorsAvailableToMakeAnAppointment(this.newAppointmentForm.get('clinic')?.value)
    //   .subscribe(
    //     ({ doctors }) => {
    //       this.newAppointmentForm.get('doctor')?.enable();
    //       this.doctorList = doctors;
    //   }
    // )
    return this.doctorList;
  }



  createAppointment() {
    if (!this.newAppointmentForm.invalid && this.patient?.id) {
      const { start, clinic, doctor, time } = this.newAppointmentForm.value;
       const appointmentForm = {
        start: addHours( new Date(start), parseInt(time)),
        end: addHours( new Date(start), parseInt(time)+1),
        title: this.completename,
        clinic,
        doctor,
        patient: this.patient?.id,
        createdby:this.userLogged
      }
      this.appointmentService.createNewAppointment(appointmentForm).subscribe(
        (resp: any)=>{
          if (resp.ok) {
            this.isDocument_numberCorrenct = false;
            this.newAppointmentForm.reset();
            this.confirmPatientForm.reset();
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

  close(): void {
    this.dialogRef.close();
  }
}
