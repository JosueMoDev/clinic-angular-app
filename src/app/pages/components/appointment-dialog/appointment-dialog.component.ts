import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import { PatientService } from 'src/app/services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error, success } from '../../../helpers/sweetAlert.helper';
import { Patient } from 'src/app/models/patient.model';
import { AuthService } from 'src/app/services/auth.service';
import { AppoinmentService } from 'src/app/services/appoinment.service';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styles: [
  ]
})
export class AppointmentDialogComponent {
  public confirmPatientForm!: FormGroup;
  public newAppointmentForm!: FormGroup;
  public patient!: Patient | null;
  public userLogged!: string;
  public isDocument_numberCorrenct: boolean = false;

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private appointmentService: AppoinmentService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    this.userLogged = this.authService.currentUserLogged.id        
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['048507907', [Validators.required, Validators.minLength(9)]]
    });

    this.newAppointmentForm = this.formBuilder.group({
      createdby: [this.userLogged, [Validators.required]],
      clinic: ['6407c555c2b922df6a51892e', [Validators.required]],
      doctor: ['640f5e005315005242ddb7d9', [Validators.required]],
      patient: ['64166963788b744d6897d617', [Validators.required]],
      start: [this.data['start'], [Validators.required]],
      end: [this.data['end'], [Validators.required]],
      title: ['', [Validators.required]]
      
      
    });
  }

  get patientByDocumentNumber() { return this.newAppointmentForm.patchValue({ 'title': this.completename }) }
  get document_number() { return this.confirmPatientForm.get('document_number') }
  get completename() { return this.patient?.name+' '+this.patient?.lastname }


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
    if (!this.newAppointmentForm.invalid) {
      this.appointmentService.createNewAppointment(this.newAppointmentForm.value).subscribe(
        (resp: any)=>{
          if (resp.ok) {
            this.isDocument_numberCorrenct = false;
            this.newAppointmentForm.reset();
            this.confirmPatientForm.reset();
            this.dialogRef.close();
            success(resp.message);
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
