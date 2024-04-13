import { Component, inject, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS,
} from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAssignmentComponent } from '../../clinic-assignment.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CommonModule } from '@angular/common';
import { ClinicAssigmentService } from '../../services/clinic-assigment.service';
import { Account } from 'src/app/models/account.model';
@Component({
  selector: 'app-asigment-dialog',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './assigment-dialog.component.html',
  styleUrl: './assigment-dialog.component.css',
})
export class AssigmentDialogComponent {
  private readonly clinicAssignmentService = inject(ClinicAssigmentService);

  public assignmentForm!: FormGroup;
  public assignmentList!: FormArray<any>;
  public thereIsSomebodyToAssing: number = 0;
  public doctors: Account[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private updateProfile: UpdateProfileService,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<ClinicAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.doctors = this.data.doctors;
    this.assignmentForm = this.formBuilder.group({
      doctors: this.formBuilder.array([]),
    });
  }
  addToAssignmentList(event: any) {
    this.assignmentList = this.assignmentForm.controls[
      'doctors'
    ] as FormArray;
    if (event.checked) {
      this.assignmentList.push(new FormControl(event.source.value));
    } else {
      const index = this.assignmentList.controls.findIndex(
        (staff: any) => staff.value === event.source.value
      );
      this.assignmentList.removeAt(index);
    }
    this.thereIsSomebodyToAssing = this.assignmentList.length;
  }
  get doctorsList() {
    return this.assignmentForm.get('doctors')?.value;
  }
  saveAssignment() {
    console.log(this.doctorsList)
    this.clinicAssignmentService
      .assignDoctorsToClinic(this.data.clinic, this.doctorsList)
      .subscribe({

        next: () => {
          
          success('Assignment completed');
          this.store.dispatch(ui.isLoadingTable());
        },
        error: () => {
          error('Error on assigment');
        }
      }
      );
    this.dialogRef.close();
  }
}
