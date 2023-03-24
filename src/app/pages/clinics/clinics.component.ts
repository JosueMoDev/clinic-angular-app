import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { RegisterClinicComponent } from '../components/register-clinic/register-clinic.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'
import { UpdateProfileService } from '../../services/update-profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { success, error } from '../../helpers/sweetAlert.helper';


@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styles: [
  ]
})
export class ClinicsComponent {
  public uiSubscription!: Subscription;
  public clinicList: Clinic[] = [];
  public dataTemp: Clinic[] = [];

  public length!:number;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex:number = 0;
  public pageSizeOptions: number[] = [5, 10, 25];
  
  public hidePageSize: boolean = false;
  public showPageSizeOptions: boolean = true;
  public disabled: boolean = false;
  public pageEvent!: PageEvent;
  public currentUserLogged!: User | Patient
  
  

  constructor(
    private clinicService: ClinicService,
    private store: Store<AppState>,
    private authService: AuthService,
    public updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public mat: MatPaginatorIntl
  
  ) { }

  ngOnInit(): void {
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Clinics per page';
    this.currentUserLogged = this.authService.currentUserLogged;
    this.allClinics()
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.allClinics();
      }
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
  
  openDialog(): void {

    this.matDialog.open(RegisterClinicComponent, {
      width: '100%',
      height: '80%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  } 


  allClinics() {
    this.clinicService.allClinics(this.from)
      .subscribe(
        ({ clinics, total }) => {
          this.clinicList = clinics;
          this.dataTemp = clinics;
          this.length = total;
        }
      )
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex=e.pageIndex
    
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize
    } else { 
      this.from = this.from - this.pageSize
    }
    this.allClinics()

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log(this.showPageSizeOptions)
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  changeClinicState(clinic_to_change: string, user_logged: string ) {
    this.clinicService.changeClinicStatus(clinic_to_change, user_logged).subscribe((resp: any)=> { 
      if (resp.ok) {
        success(resp.message)
        this.allClinics();
      }
    }, (err)=>{error(err.error.message)});
  }

  
}
