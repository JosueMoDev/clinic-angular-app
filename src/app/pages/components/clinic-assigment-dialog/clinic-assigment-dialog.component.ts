import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { ClinicService } from 'src/app/services/clinic.service';
import { UpdateProfileService } from '../../../services/update-profile.service';
import * as ui from '../../../store/actions/ui.actions';

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
    private clinicService: ClinicService,
    private updateProfile: UpdateProfileService,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<ClinicAssigmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  ngOnInit(): void {
    this.employeeStaff = this.data.doctors
    this.assignmentForm = this.formBuilder.group({
      selectedStaff: this.formBuilder.array([])
    });
    
    
  }
  addToAssignmentList(event: any) {
 
    const selectedStaff = (this.assignmentForm.controls['selectedStaff'] as FormArray);
    if (event.checked) {
      selectedStaff.push(new FormControl(event.source.value));
    } else {
      const index = selectedStaff.controls
      .findIndex( staff => staff.value === event.source.value);
      selectedStaff.removeAt(index);
    }
  }
  saveAssignment() {
    this.clinicService.assignDoctorsToClinic(this.data.clinic, this.assignmentForm.value).subscribe(
    (resp: any) => { 
      if (resp.ok) {
        this.updateProfile.clinicToUpdate(resp.clinic);
        this.store.dispatch(ui.isLoadingTable())
        success(resp.message);
      }
    }, (err: any) => {
      error(err.error.message)
    }
    );
    this.dialogRef.close();
  }
}
