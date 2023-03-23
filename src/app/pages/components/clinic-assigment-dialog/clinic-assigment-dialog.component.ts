import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-clinic-assigment-dialog',
  templateUrl: './clinic-assigment-dialog.component.html',
  styles: [
  ],
  providers: [
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check'} as MatCheckboxDefaultOptions}
  ]
})
export class ClinicAssigmentDialogComponent {
  public assignmentForm!: FormGroup;

  employeeStaff: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClinicAssigmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  ngOnInit(): void {
    this.employeeStaff = this.data
    this.assignmentForm = this.formBuilder.group({
      selectedStaff: this.formBuilder.array([])
    });
    
    
  }
  addToAssignmentList(event: any) {
 
    const selectedStaff = (this.assignmentForm.controls['selectedStaff'] as FormArray);
    if (event.checked) {
      console.log(event.source.value, 'Added')
      selectedStaff.push(new FormControl(event.source.value));
    } else {
      const index = selectedStaff.controls
      .findIndex( staff => staff.value === event.source.value);
      selectedStaff.removeAt(index);
      console.log(event.source.value, 'removed')

    }
  }
  saveAssignment() {
    console.log(this.assignmentForm.value);
  }
}
