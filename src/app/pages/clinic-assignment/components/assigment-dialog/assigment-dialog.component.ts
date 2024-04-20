import { Account } from 'src/app/models/account.model';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AppState } from 'src/app/app.reducer';
import { ClinicAssigmentService } from '../../services/clinic-assigment.service';
import { ClinicAssignmentComponent } from '../../clinic-assignment.component';
import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as ui from 'src/app/store/actions/ui.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
interface ClinicAssignmentData {
  doctors: Account[];
  clinic: string;
}
@Component({
  selector: 'app-asigment-dialog',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './assigment-dialog.component.html',
  styleUrl: './assigment-dialog.component.css',
})
export class AssigmentDialogComponent {
  private readonly clinicAssignmentService = inject(ClinicAssigmentService);
  private formBuilder = inject(FormBuilder);
  private store = inject(Store<AppState>);
  public snackBar = inject(MatSnackBar);

  public assignmentList!: FormArray<any>;
  public hasDoctorsToAssign: number = 0;
  public doctors: Account[] = this.data.doctors;
  public assignmentForm: FormGroup = this.formBuilder.group({
    doctors: this.formBuilder.array([]),
  });

  constructor(
    public dialogRef: MatDialogRef<ClinicAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClinicAssignmentData
  ) {}

  addToAssignmentList(event: any) {
    this.assignmentList = this.assignmentForm.controls['doctors'] as FormArray;
    if (event.checked) {
      this.assignmentList.push(new FormControl(event.source.value));
    } else {
      const index = this.assignmentList.controls.findIndex(
        (doctor: any) => doctor.value === event.source.value
      );
      this.assignmentList.removeAt(index);
    }
    this.hasDoctorsToAssign = this.assignmentList.length;
  }
  get doctorsList() {
    return this.assignmentForm.get('doctors')?.value;
  }
  saveAssignment() {
    this.clinicAssignmentService
      .assignDoctorsToClinic(this.data.clinic, this.doctorsList)
      .subscribe({
        next: () => {
          this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: {
              message: 'Assignment has done',
              isSuccess: false,
            },
          });
          this.store.dispatch(ui.isLoadingTable());
        },
        error: ({ error }) => {
          this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: {
              message: error.error,
              isSuccess: false,
            },
          });
        },
      });
    this.dialogRef.close();
  }
}
