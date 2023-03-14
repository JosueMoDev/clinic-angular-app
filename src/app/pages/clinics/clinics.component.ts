import { Component } from '@angular/core';
import { Dialog} from '@angular/cdk/dialog';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { RegisterClinicComponent } from '../components/register-clinic/register-clinic.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'


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

  
  

  constructor(
    private clinicService: ClinicService,
    public dialog: Dialog,
    private store: Store<AppState>,
    public mat: MatPaginatorIntl
  
  ) { }

  ngOnInit(): void {
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Clinics per page';
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

    this.dialog.open(RegisterClinicComponent, {
      width: '100vh',
      minWidth: '100vh',
      backdropClass:'top'
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

  
}
