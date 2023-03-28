import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styles: [
  ]
})
export class MedicalRecordComponent implements OnInit {
  public medicalRecordForm!: FormGroup;

  
  ngOnInit() {
    this.medicalRecordForm = this.formBuilder.group({
      text:['<h1>Programing</h1><h2><span class="ql-font-monospace">Angular</span></h2><ul><li>Angular Material</li><li>Prime Ng</li><li>Material UI</li></ul>', [Validators.required]]
    })
  }
  constructor(private formBuilder: FormBuilder) { }

  newRecordForPatient() {
    console.log( this.medicalRecordForm.get('text')?.value)
  }
  
}