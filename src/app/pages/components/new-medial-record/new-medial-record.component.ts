import { Component, Inject } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { PatientMedicalRecordService } from 'src/app/services/patient-medical-record.service';

@Component({
  selector: 'app-new-medial-record',
  templateUrl: './new-medial-record.component.html',
  styles: [
  ]
})
export class NewMedialRecordComponent {
  public medicalRecordForm!: FormGroup;
  public recordInformation!: any[] | null;
  public isEditable!: boolean
  ngOnInit() {
    this.recordInformation = this.data.record;
    this.isEditable = this.data.isEditable;
    console.log( this.recordInformation )
    this.medicalRecordForm = this.formBuilder.group({
      reason:['', [Validators.required]],
      details:['', [Validators.required]]
    })
  }
  constructor(
    private formBuilder: FormBuilder,
    private medicalRecord: PatientMedicalRecordService,
    private store: Store<AppState>,
    public matDialogRef: MatDialogRef<NewMedialRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  get reason() { return this.medicalRecordForm.get('reason') }
  get isFormValid(){ return this.medicalRecordForm.invalid}
  newRecordForPatient() {
    if (!this.medicalRecordForm.invalid) {
      this.medicalRecord.createMedicalRecord(this.data.id, this.medicalRecordForm.value, this.data.document_number)
        .subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.medicalRecordForm.reset()
              success(resp.message);
              this.matDialogRef.close();
              this.store.dispatch(ui.isLoadingTable());
            }
          },
          (err:any)=>{ error(err.error.message) }
        )
    }
  }
}
