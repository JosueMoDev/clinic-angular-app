import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { PatientMedicalRecordService } from 'src/app/services/patient-medical-record.service';

import { MedicalRecord } from 'src/app/models/medical_record.model';


import { NewMedialRecordComponent } from '../components/new-medial-record/new-medial-record.component';
import { EditMedicalRecordComponent } from '../components/edit-medical-record/edit-medical-record.component';
import { Rol } from 'src/app/interfaces/authorized-roles.enum';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';



@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styles: [
  ]
})
export class MedicalRecordComponent {
  public userRol!: Rol
  public doctor!: string;
  public document!: string;
  public isDocument_numberCorrenct: boolean = false;
  public patient!: any
  public uiSubscription!: Subscription;

  // ? Form
  public confirmPatientForm!: FormGroup;

  // ? table
  public medicalRecordsList: MedicalRecord[] = [];
  public dataTemp: [] = [];

  //? angular material paginator 
  public from: number = 0;
  public hidePageSize: boolean = false;
  public length!: number;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pageSizeOptions: number[] = [5, 10, 25];
  public showPageSizeOptions: boolean = true;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private patientMedicalRecord: PatientMedicalRecordService,
    private store: Store<AppState>,
    public matDialog: MatDialog,
    public matconfig: MatPaginatorIntl
  ) { }

  ngOnInit(): void {
    this.doctor = this.authService.currentUserLogged()?.id as any;
    this.userRol = this.authService.currentUserLogged()?.role as any;
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
      // this.patientService.getSinglePatient(this.document_number?.value).subscribe(
      //   (resp: any) => {
      //     if (resp.ok) {
      //       this.patient = resp.patient;
      //       this.document = this.patient!.document_number;
      //       this.isDocument_numberCorrenct = true;
      //       this.allRecordByPatient()
      //       this.confirmPatientForm.disable();
      //     }
      //   },
      //   (err: any) => { error(err.error.message) }
      // )
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

  createNewMedicalRecord(): void {
    this.matDialog.open(NewMedialRecordComponent, {
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: { id: this.patient!.id, document_number: this.patient!.document_number, doctor: this.doctor }
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
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: { id: medical_record, isReadOnly: true }
    });
  }
  editMedicalRecord(medical_record: string) {
    this.matDialog.open(EditMedicalRecordComponent, {
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: { id: medical_record, isReadOnly: false, doctor: this.doctor }
    });
  }
}