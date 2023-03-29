import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';
import { error } from 'src/app/helpers/sweetAlert.helper';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient.service';
import { NewMedialRecordComponent } from '../components/new-medial-record/new-medial-record.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EditMedicalRecordComponent } from '../components/edit-medical-record/edit-medical-record.component';


@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styles: [
  ]
})
export class MedicalRecordComponent  {
  public confirmPatientForm!: FormGroup;
  public patient!: Patient | null;
  public records: any[] = []
  public isDocument_numberCorrenct: boolean = false;
  public uiSubscription!: Subscription;
  public isEditable!: boolean;

  constructor(
    private patientService: PatientService,
    private authService : AuthService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    public matDialog: MatDialog,
  ) { }
  
  ngOnInit(): void {
    this.isEditable = (this.authService.currentUserLogged.rol ==='doctor')
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['', [Validators.required, Validators.minLength(9)]]
    });
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {      
        this.confirmCurrentPatient();
        this.store.dispatch(ui.isLoadingTable());
      }
    })
   
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  get document_number() { return this.confirmPatientForm.get('document_number'); }

  confirmCurrentPatient() {
    if (!this.document_number?.invalid) {
      this.patientService.getSinglePatient(this.document_number?.value).subscribe(
        (resp: any)=>{
          if (resp.ok) {
            this.patient = resp.patient;
            this.records = [ ...resp.patient.medical_records]
            this.isDocument_numberCorrenct = true;
            this.store.dispatch(ui.isLoadingTable())
            this.confirmPatientForm.disable();
          }
        },
        (err:any)=>{ error(err.error.message)}
      )
    }
  }
  createNewRecord(): void {
    this.matDialog.open(NewMedialRecordComponent, {
      width:'100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ id:this.patient!.id, document_number: this.patient!.document_number, isEditable:false }
    });
  } 

  editRecord(record:any): void {
    this.matDialog.open(NewMedialRecordComponent, {
      width:'100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ id:this.patient!.id, document_number: this.patient!.document_number, record:{...record}, isEditable:false }
    });
  } 
  showRecord(record: any): void {
    console.log( record)
    // this.matDialog.open(EditMedicalRecordComponent, {
    //   width:'100%',
    //   hasBackdrop: true,
    //   disableClose: true,
    //   role: 'dialog',
    //   data:{ record:{...record}, isEditable:true }
    // });
  }
  
}