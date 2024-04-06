import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';


import { UpdateProfileService } from 'src/app/services/update-profile.service';


import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { ClinicService } from './services/clinic.service';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Account } from 'src/app/models/account.model';
import { Clinic } from './interface/clinic-response.interface';
import { CreateClinicComponent } from './components/create-clinic.component';


@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.css'],
})
export class ClinicsComponent {
  public currentUserLogged!: Account;
  public uiSubscription!: Subscription;

  // ? table
  public clinicList: Clinic[] = [];
  public dataTemp: Clinic[] = [];

  //? angular material paginator
  public from: number = 0;
  public hidePageSize: boolean = false;
  public length: number = 0;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pageSizeOptions: number[] = [5, 10, 25];
  public showPageSizeOptions: boolean = true;

  private readonly clinicService = inject(ClinicService);
  private readonly authenticationService = inject(AuthenticationService);
  displayedColumns: string[] = ['avatar', 'name', 'registerNumber', 'address', 'action'];

  constructor(
    private store: Store<AppState>,
    public updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public matconfig: MatPaginatorIntl
  ) {}

  ngOnInit(): void {
    this.matconfig.previousPageLabel = '';
    this.matconfig.nextPageLabel = '';
    this.matconfig.itemsPerPageLabel = 'Clinics per page';
    this.currentUserLogged =
      this.authenticationService.currentUserLogged() as Account;
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
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  }

  allClinics() {
    this.clinicService.allClinics(this.pageIndex+1, this.pageSize).subscribe(({ clinics, total }) => {
        console.log('El total de registros', total);

      this.clinicList = clinics;
      this.dataTemp = clinics;
      this.length = total;
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
    this.allClinics();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  changeClinicState(clinic_to_change: string, user_logged: string) {
    this.clinicService
      .changeClinicStatus(clinic_to_change, user_logged)
      .subscribe(
        (resp: any) => {
          if (resp.ok) {
            success(resp.message);
            this.allClinics();
          }
        },
        (err) => {
          error(err.error.message);
        }
      );
  }
}
