import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import { PatientService } from 'src/app/services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error, success } from '../../../helpers/sweetAlert.helper';
import { Patient } from 'src/app/models/patient.model';
import { AuthService } from 'src/app/services/auth.service';
import { AppoinmentService } from 'src/app/services/appoinment.service';
import * as ui from '../../../store/actions/ui.actions';
import {
  addHours,
} from 'date-fns';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { Appointment } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-actions-appointment-selected',
  templateUrl: './actions-appointment-dialog.component.html',
  styles: [
  ]
})
export class ActionsAppointmentDialogComponent {
  public confirmPatientForm!: FormGroup;
  public newAppointmentForm!: FormGroup;
  public patient!: Patient | null;
  public userLogged!: string;
  public isDocument_numberCorrenct: boolean = false;
  public minDate: Date;
  public maxDate: Date;
  public minTime: string = '08:00';
  public maxTime: string = '18:00';
  public dataAppointment!: Appointment;  
  
  constructor(
    private patientService: PatientService,
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
    
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['048507907', [Validators.required, Validators.minLength(9)]]
    });
    
    this.newAppointmentForm = this.formBuilder.group({
      clinic: [this.dataAppointment.clinic, [Validators.required]],
      doctor: [this.dataAppointment.doctor, [Validators.required]],
      start: [this.dataAppointment.start, [Validators.required]],
      time:[ appointmentTime ,[Validators.required]]
    });
  }

  get patientByDocumentNumber() { return this.newAppointmentForm.patchValue({ 'title': this.completename }) }
  get document_number() { return this.confirmPatientForm.get('document_number') }
  get completename() { return this.patient?.name+' '+this.patient?.lastname }
  get endDate() { return this.newAppointmentForm.get('start')?.value}

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
      console.log( addHours(new Date(start), parseInt(time)))
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
