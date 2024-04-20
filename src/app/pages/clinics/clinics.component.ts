import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';


import { ClinicService } from './services/clinic.service';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Account } from 'src/app/models/account.model';
import { Clinic } from '../../interfaces/clinic-response.interface';
import { CreateClinicComponent } from './components/create-clinic.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.css'],
})
export class ClinicsComponent {
  private readonly clinicService = inject(ClinicService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly store = inject(Store<AppState>);
  public snackBar = inject(MatSnackBar);

  public currentUserLogged: Account =
    this.authenticationService.currentUserLogged() as Account;
  public uiSubscription!: Subscription;

  public clinicList: Clinic[] = [];
  public dataTemp: Clinic[] = [];

  public from: number = 0;
  public length: number = 0;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;

  public displayedColumns: string[] = [
    'avatar',
    'name',
    'registerNumber',
    'address',
    'action',
  ];

  constructor(
    public matDialog: MatDialog,
    public matconfig: MatPaginatorIntl
  ) {}

  ngOnInit(): void {
    this.matconfig.itemsPerPageLabel = 'Clinics per page';
    this.allClinics();
    this.uiSubscription = this.store.select('ui').subscribe((state) => {
      if (state.isLoading) {
        this.allClinics();
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  openDialog(): void {
    this.matDialog.open(CreateClinicComponent, {
      width: '60%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  }

  allClinics() {
    this.clinicService.allClinics(this.pageIndex + 1, this.pageSize).subscribe({
      next: ({ clinics, pagination }) => {
        this.clinicList = clinics;
        this.dataTemp = clinics;
        this.length = pagination.total;
      },
      error: (error) => console.log(error),
    });
  }

  matPaginatinatorHander(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex = e.pageIndex;

    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize;
    } else {
      this.from = this.from - this.pageSize;
    }
    this.allClinics();
  }

  changeClinicState(clinic: string, account: string) {
    this.clinicService.changeClinicStatus(clinic, account).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          duration: 2000,
          data: {
            message: 'Se cambio el estado exitosamente',
            isSuccess: true,
          },
        });
        this.allClinics();
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
  }

  showClinic(clinic: Clinic) {
    this.clinicService.showClinic(clinic);
  }
}
