import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { Clinic } from 'src/app/models/clinic.model';

import { Rol } from 'src/app/interfaces/authorized-roles.enum';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { DoctorAssigned } from './interfaces/doctor-assigned.interface';
import { AssigmentDialogComponent } from './components/assigment-dialog/assigment-dialog.component';
import { ClinicAssigmentService } from './services/clinic-assigment.service';

@Component({
  selector: 'app-clinic-assignment',
  templateUrl: './clinic-assignment.component.html',
  styleUrl: './clinic-assignment.component.css',
})
export class ClinicAssignmentComponent {
  private readonly clinicAssignment = inject(ClinicAssigmentService);
  public uiSubscription!: Subscription;

  public currentUserLogged!: any;
  public clinic_id!: string;
  public profileSelected!: Clinic;
  public userRol!: Rol;

  // ? Doctors Availables to be assigned
  public doctorsAvailableList: any[] = [];

  // ? Doctors Availables to be assigned
  public doctorsAssignedList: any[] = [];
  public dataTempAssigned: any[] = [];

  // ? Angular Material Paginator
  public length: number = 0;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex: number = 0;
  public pageSizeOptions: number[] = [5, 10, 25];
  public hidePageSize: boolean = false;
  public showPageSizeOptions: boolean = true;
  public pageEvent!: PageEvent;
  displayedColumns: string[] = [
    'avatar',
    'name',
    'email',
    'duiNumber',
    'action',
  ];

  constructor(
    private store: Store<AppState>,
    private authService: AuthenticationService,
    private updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public mat: MatPaginatorIntl
  ) {}

  ngOnInit(): void {
    this.userRol = this.authService.currentUserLogged()?.role as any;
    this.clinic_id = this.updateProfileService.clinicProfile.id;
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Doctors assigned per page';
    this.allEmployeesAvaibleToBeAssigned();
    this.allEmployeesAssignedToClinic();
    this.uiSubscription = this.store.select('ui').subscribe((state) => {
      if (state.isLoading) {
        this.allEmployeesAvaibleToBeAssigned();
        this.allEmployeesAssignedToClinic();
        this.profileSelected = this.updateProfileService.clinicProfileToUpdate;
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  allEmployeesAvaibleToBeAssigned() {
    this.clinicAssignment.getDoctorsAvilableToAssign().subscribe((doctors) => {
      this.doctorsAvailableList = doctors;
    });
  }

  allEmployeesAssignedToClinic() {
    this.clinicAssignment
      .allEmployeesAssingedToClinic(this.clinic_id)
      .subscribe((doctors) => {
        this.doctorsAssignedList = doctors;
        this.dataTempAssigned = doctors;
        this.length = this.doctorsAssignedList.length;
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
    this.allEmployeesAssignedToClinic();
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  removeAllAssigned() {
    const doctors = this.doctorsAssignedList.map(({ id }) => id);
    this.clinicAssignment
      .removeADoctorsAssignedToClinic( doctors, this.clinic_id)
      .subscribe({
        next: () => {
          this.store.dispatch(ui.isLoadingTable());
          success('Deleted Correctly');
        },
        error: () => {
          error('No Deleted');
        },
      });
  }
  removeADoctorAssigned(doctor_id: string) {
    this.clinicAssignment
      .removeADoctorsAssignedToClinic([doctor_id], this.clinic_id)
      .subscribe({
        next: () => {
          this.store.dispatch(ui.isLoadingTable());
          success('Deleted Correctly');
        },
        error: () => {
          error('No Deleted');
        },
      });
  }

  assignmentListDialog(): void {
    this.matDialog.open(AssigmentDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: 'auto',
      role: 'dialog',
      data: { doctors: this.doctorsAvailableList, clinic: this.clinic_id },
    });
  }
}
