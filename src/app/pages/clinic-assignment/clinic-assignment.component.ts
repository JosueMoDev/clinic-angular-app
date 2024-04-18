import { Account } from 'src/app/models/account.model';
import { AppState } from 'src/app/app.reducer';
import { AssigmentDialogComponent } from './components/assigment-dialog/assigment-dialog.component';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicAssigmentService } from './services/clinic-assigment.service';
import { ClinicService } from '../clinics/services/clinic.service';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Rol } from 'src/app/interfaces/authorized-roles.enum';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import * as ui from 'src/app/store/actions/ui.actions';

@Component({
  selector: 'app-clinic-assignment',
  templateUrl: './clinic-assignment.component.html',
  styleUrl: './clinic-assignment.component.css',
})
export class ClinicAssignmentComponent {
  private readonly clinicAssignment = inject(ClinicAssigmentService);
  private store = inject(Store<AppState>);
  private authService = inject(AuthenticationService);
  private clinicService = inject(ClinicService);

  public uiSubscription!: Subscription;

  public currentUserLogged!: any;
  public clinic_id!: string;
  public profileSelected!: Clinic;
  public userRol: Rol = this.authService.currentUserLogged()?.role as Rol;

  public doctorsAvailableList: Account[] = [];
  public doctorsAssignedList: Account[] = [];
  public dataTempAssigned: Account[] = [];

  public length: number = 0;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex: number = 0;
  public pageEvent!: PageEvent;
  public displayedColumns: string[] = [
    'avatar',
    'name',
    'email',
    'duiNumber',
    'action',
  ];

  constructor(public matDialog: MatDialog, public mat: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.clinic_id = this.clinicService.selectedClinic()!.id;
    this.mat.itemsPerPageLabel = 'Doctors assigned per page';
    this.allDoctorsAvaibleToBeAssigned();
    this.allDoctorsAssignedToClinic();
    this.uiSubscription = this.store.select('ui').subscribe((state) => {
      if (state.isLoading) {
        this.allDoctorsAvaibleToBeAssigned();
        this.allDoctorsAssignedToClinic();
        this.profileSelected = this.clinicService.selectedClinic() as Clinic;
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  allDoctorsAvaibleToBeAssigned() {
    this.clinicAssignment.getDoctorsAvilableToAssign().subscribe((doctors) => {
      this.doctorsAvailableList = doctors;
    });
  }

  allDoctorsAssignedToClinic() {
    this.clinicAssignment.allDoctorsAssingedToClinic(this.clinic_id).subscribe({
      next: (doctors) => {
        this.doctorsAssignedList = doctors;
        this.dataTempAssigned = doctors;
        this.length = this.doctorsAssignedList.length;
      },
      error: (error) => console.log(error),
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
    this.allDoctorsAssignedToClinic();
  }

  removeAllAssigned() {
    const doctors = this.doctorsAssignedList.map(({ id }) => id);
    this.clinicAssignment
      .removeADoctorsAssignedToClinic(doctors, this.clinic_id)
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
