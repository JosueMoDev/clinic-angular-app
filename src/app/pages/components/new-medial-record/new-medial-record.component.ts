import { Component, Inject } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientMedicalRecordService } from 'src/app/services/patient-medical-record.service';
@Component({
  selector: 'app-new-medial-record',
  templateUrl: './new-medial-record.component.html',
  styles: [
  ]
})
export class NewMedialRecordComponent {
  public medicalRecordForm!: FormGroup;

  ngOnInit() {
    this.medicalRecordForm = this.formBuilder.group({
      text:['<h1>Programing</h1><h2><span class="ql-font-monospace">Angular</span></h2><ul><li>Angular Material</li><li>Prime Ng</li><li>Material UI</li></ul>', [Validators.required]]
    })
  }
  constructor(
    private formBuilder: FormBuilder,
    private medicalRecord: PatientMedicalRecordService,
    public MatDialogRef: MatDialogRef<NewMedialRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  newRecordForPatient() {
    if (!this.medicalRecordForm.invalid) {
      this.medicalRecord.createMedicalRecord(this.data.id, this.medicalRecordForm.get('text')?.value, this.data.document_number)
        .subscribe(
          (resp: any) => {
            console.log(resp)
          },
          (err:any)=>{console.log(err) }
        )
    }
  }
}
