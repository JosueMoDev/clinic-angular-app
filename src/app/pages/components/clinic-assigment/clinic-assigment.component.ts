import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as ui from '../../../store/actions/ui.actions';

import { ClinicService } from '../../../services/clinic.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { Clinic } from 'src/app/models/clinic.model';
import { User } from '../../../models/user.model';
import { Patient } from 'src/app/models/patient.model';

import { success, error } from '../../../helpers/sweetAlert.helper';

import { ClinicAssigmentDialogComponent } from '../clinic-assigment-dialog/clinic-assigment-dialog.component';

@Component({
  selector: 'app-clinic-assigment',
  templateUrl: './clinic-assigment.component.html',
  styles: [
  ]
})
export class ClinicAssigmentComponent {
  public uiSubscription!: Subscription;
  public doctorsList: User[] = [];
  public dataTemp: User[] = [];

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
  public clinic_id!: string;
  public doctors_assigned!: any[] | undefined

  public profileSelected!: Clinic;
  constructor(
    private clinicService: ClinicService,
    private userService: UserService,
    private store: Store<AppState>,
    private authService: AuthService,
    private updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public mat: MatPaginatorIntl
  
  ) { }

  ngOnInit(): void {
    this.clinic_id = this.updateProfileService.clinicProfile.clinic_id
    const doctors = this.updateProfileService.clinicProfile.doctors_assigned?.map(doctor => doctor)
    this.doctors_assigned = doctors 
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Clinics per page';
    this.currentUserLogged = this.authService.currentUserLogged;
    this.allEmployeesToAssign()
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        
        this.allEmployeesToAssign();
        this.profileSelected = this.updateProfileService.clinicProfileToUpdate;
        this.doctors_assigned = this.profileSelected.doctors_assigned;
        this.store.dispatch(ui.isLoadingTable());
      }
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
  openAssingmentDoctorDialog(): void {

    this.matDialog.open(ClinicAssigmentDialogComponent, {
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: { doctors:this.doctorsList, clinic: this.clinic_id }
    });
  } 

  allEmployeesToAssign() {
    this.userService.allEmployesAviblesToAssign(this.from)
    .subscribe(
      ({ doctors, total }) => {
          this.doctorsList = doctors;
          this.dataTemp = doctors;
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
    this.allEmployeesToAssign()

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
        this.allEmployeesToAssign();
      }
    }, (err)=>{error(err.error.message)});
  }

  removeallassigned() {
    if (!!this.doctors_assigned?.length) {      
      const doctors = this.doctors_assigned?.map( doctor => doctor._id )
      this.clinicService.removeAllDoctorsAssignedToClinic(this.clinic_id, doctors).subscribe(
        (resp: any) => { 
            if (resp.ok) {
            this.updateProfileService.clinicToUpdate(resp.clinic);
            this.store.dispatch(ui.isLoadingTable());
            success(resp.message);
          }
        }, (err: any) => {
          error(err.error.message)
        }
      );    
     }
  }
  removeadoctorassigned(doctor_id: string) {
    if (!!this.doctors_assigned?.length && doctor_id) { 
      const doctors = this.doctors_assigned?.map(doctor => doctor._id)
      const doctor_deleted = doctors.filter(doctor => doctor !== doctor_id)
      this.clinicService.removeADoctorAssignedToClinic(this.clinic_id, doctor_id ,doctor_deleted).subscribe(
        (resp: any) => { 
            if (resp.ok) {
            this.updateProfileService.clinicToUpdate(resp.clinic);
            this.store.dispatch(ui.isLoadingTable());
            success(resp.message);
          }
        }, (err: any) => {
          error(err.error.message)
        }
      );    
     }
  }

}
