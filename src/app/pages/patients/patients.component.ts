import { Component } from '@angular/core';
import { Dialog} from '@angular/cdk/dialog';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';
import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styles: [
  ]
})
export class PatientsComponent {
  public uiSubscription!: Subscription;
  public patientList: Patient[] = [];
  public dataTemp: Patient[] = [];

  public length!:number;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex:number = 0;
  public pageSizeOptions: number[] = [5, 10, 25];
  
  public hidePageSize: boolean = false;
  public showPageSizeOptions: boolean = true;
  public disabled: boolean = false;
  public pageEvent!: PageEvent;
  


  constructor(
    private patientService: PatientService,
    private store: Store<AppState>,
    private ui : UiService,
    public dialog: Dialog,
    public updateProfileService: UpdateProfileService,
    public mat: MatPaginatorIntl
    
  ) { }

  ngOnInit(): void {
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Patients per page';
    this.allPatients();
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.allPatients();
      }
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
  openDialog(userType: string): void {
    this.ui.currentUserType(userType)
    this.dialog.open(ModalUserRegisterComponent, {
      width: '100vh',
      minWidth: '100vh',
      backdropClass:'top'
    });
  } 


  allPatients() {
    this.patientService.allPatients(this.from)
      .subscribe(
        ({ patients, total }) => {
          this.patientList = patients;
          this.dataTemp = patients;
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
    this.allPatients()

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log(this.showPageSizeOptions)
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  
  
}
