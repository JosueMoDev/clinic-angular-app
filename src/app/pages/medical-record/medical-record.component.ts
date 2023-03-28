import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { error } from 'src/app/helpers/sweetAlert.helper';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';
import { NewMedialRecordComponent } from '../components/new-medial-record/new-medial-record.component';


@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styles: [
  ]
})
export class MedicalRecordComponent  {
  public confirmPatientForm!: FormGroup;
  public patient!: Patient | null;
  public isDocument_numberCorrenct: boolean = false;

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    public matDialog: MatDialog,
  ){}
  ngOnInit(): void {
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['', [Validators.required, Validators.minLength(9)]]
    });
  }
  get document_number() { return this.confirmPatientForm.get('document_number'); }

  confirmCurrentPatient() {
    if (!this.document_number?.invalid) {
      this.patientService.getSinglePatient(this.document_number?.value).subscribe(
        (resp: any)=>{
          if (resp.ok) {
            this.patient = resp.patient;
            this.isDocument_numberCorrenct = true;
            this.confirmPatientForm.disable();
          }
        },
        (err:any)=>{ error(err.error.message)}
      )
    }
  }
  openDialog(): void {
    this.matDialog.open(NewMedialRecordComponent, {
      width:'100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ id:this.patient!.id, document_number: this.patient!.document_number }
    });
  } 
  
}