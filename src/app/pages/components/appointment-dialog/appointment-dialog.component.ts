import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {addHours} from 'date-fns';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { AppoinmentService } from 'src/app/services/appoinment.service';
import { PatientService } from 'src/app/services/patient.service';
import { ClinicService } from 'src/app/services/clinic.service';

import { Patient } from 'src/app/models/patient.model';
import { Clinic } from 'src/app/models/clinic.model';

import { error, success } from 'src/app/helpers/sweetAlert.helper';


@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styles: []
})
export class AppointmentDialogComponent {
  public confirmPatientForm!: FormGroup;
  public newAppointmentForm!: FormGroup;
  public patient!: Patient | null;
  public userLogged!: string;
  public isDocument_numberCorrenct: boolean = false;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';

  public clinicList: Clinic[] = []
  public doctorList: any[] | undefined

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private appointmentService: AppoinmentService,
    private authService: AuthService,
    private store: Store<AppState>,
    private clinicService: ClinicService,
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
    this.userLogged = this.authService.currentUserLogged.id 
    
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['', [Validators.required, Validators.minLength(9)]]
    });
    
    this.newAppointmentForm = this.formBuilder.group({
      clinic: [null, [Validators.required]],
      doctor: [null, [Validators.required]],
      start: [null, [Validators.required]],
      time:['',[Validators.required]]
    });
    this.allClinics();
    this.newAppointmentForm.get('doctor')?.disable()
  }


  allClinics() {
    this.clinicService.allClinics(0)
      .subscribe(
        ({ clinics }) => {
          this.clinicList = clinics
          this.clinics
        }
      )
  }
  get clinics() { return this.clinicList;  }
  get patientByDocumentNumber() { return this.newAppointmentForm.patchValue({ 'title': this.completename }); }
  get document_number() { return this.confirmPatientForm.get('document_number'); }
  get completename() { return this.patient?.name + ' ' + this.patient?.lastname; }
  get clinicId() { return this.newAppointmentForm.get('clinic')?.value; }
  
  get getDoctorsByClinic() {
    this.newAppointmentForm.get('doctor')?.disable()
    const clinicSelected = this.clinicList.filter(clinic => clinic.clinic_id === this.clinicId);
    if (clinicSelected[0].doctors_assigned!.length>=1) {
      this.newAppointmentForm.get('doctor')?.enable();
      this.doctorList = clinicSelected[0].doctors_assigned
    }
    return this.doctorList;
  }

  confirmCurrentPatient() {
    if (!this.document_number?.invalid) {
      this.patientService.getSinglePatient(this.document_number?.value).subscribe(
        (resp: any)=>{
          if (resp.ok) {
            this.patient = resp.patient;
            this.patientByDocumentNumber
            this.isDocument_numberCorrenct = true
          }
        },
        (err:any)=>{ error(err.error.message)}
      )
    }
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
