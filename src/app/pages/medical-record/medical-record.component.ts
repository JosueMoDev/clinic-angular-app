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
import { PatientMedicalRecordService } from 'src/app/services/patient-medical-record.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MedicalRecord } from 'src/app/models/medical_record.model';
import { EditMedicalRecordComponent } from '../components/edit-medical-record/edit-medical-record.component';



@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styles: [
  ]
})
export class MedicalRecordComponent  {
  public uiSubscription!: Subscription;
  public patient!: Patient | null;
  public doctor!: string;
  public isDocument_numberCorrenct: boolean = false;
  public document!: string;

  // ? Form
  public confirmPatientForm!: FormGroup;

  // ? table
  public medicalRecordsList:MedicalRecord[] = [];
  public dataTemp:[] = [];

  //? angular material paginator 
  public from: number = 0;
  public hidePageSize: boolean = false;
  public length!:number;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pageSizeOptions: number[] = [5, 10, 25];
  public showPageSizeOptions: boolean = true;

  constructor(
    private patientService: PatientService,
    private patientMedicalRecord: PatientMedicalRecordService,
    private authService : AuthService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    public matDialog: MatDialog,
    public matconfig: MatPaginatorIntl
  ) { }
  
  ngOnInit(): void {
    this.doctor = this.authService.currentUserLogged.id
    this.confirmPatientForm = this.formBuilder.group({
      document_number: ['', [Validators.required, Validators.minLength(9)]]
    });

    this.confirmCurrentPatient();

    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {   
        this.allRecordByPatient();
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
            this.document = this.patient!.document_number;
            this.isDocument_numberCorrenct = true;
            this.allRecordByPatient()
            this.confirmPatientForm.disable();
          }
        },
        (err:any)=>{ error(err.error.message)}
      )
    }
  }
  allRecordByPatient() {
    if (!this.document_number?.invalid) {
      this.patientMedicalRecord.getAllMedicalRecordsByPatient(this.document, this.from)
      .subscribe(
        ({ records, total }) => {
          this.medicalRecordsList = records;
          this.dataTemp = records;
          this.length = total;
        }
      );
    }
  }

  createNewRecord(): void {
    this.matDialog.open(NewMedialRecordComponent, {
      width:'100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ id:this.patient!.id, document_number: this.patient!.document_number, doctor: this.doctor  }
    });
  } 

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex = e.pageIndex;
    
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize;
    } else { 
      this.from = this.from - this.pageSize;
    }
    this.allRecordByPatient();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  showMedicalRecord(medical_record: string) {
    this.matDialog.open(EditMedicalRecordComponent, {
      width:'100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ id:medical_record, isReadOnly:true  }
    });
  }
  editMedicalRecord(medical_record: string) {
    this.matDialog.open(EditMedicalRecordComponent, {
      width:'100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ id:medical_record, isReadOnly:false, doctor: this.doctor  }
    });
  }
  
}