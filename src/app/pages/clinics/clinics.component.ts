import { Component } from '@angular/core';
import { Dialog} from '@angular/cdk/dialog';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicService } from '../../services/clinic.service';
import { RegisterClinicComponent } from '../components/register-clinic/register-clinic.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styles: [
  ]
})
export class ClinicsComponent {
  public uiSubscription!: Subscription;
  public totalClinics: number = 0;
  public clinicList: Clinic[] = [];
  public dataTemp: Clinic[] = [];
  public from: number = 0;
  public loading: boolean = true;
  
  

  constructor(
    private clinicService: ClinicService,
    public dialog: Dialog,
    private store: Store<AppState>
  
  ) { }

  ngOnInit(): void {
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
    this.loading = true;
    this.clinicService.allClinics(this.from)
      .subscribe(
        ({ clinics, total }) => {
          this.clinicList = clinics;
          this.dataTemp = clinics;
          this.totalClinics = total;
          this.loading = false
        }
      )
  }
  clinicPagination( from: number) {
    this.from += from;
    if (this.from < 0) {
      this.from = 0
    } else if (this.from >=this.totalClinics ) {
      this.from-=from
    }
    this.allClinics()
  }
  
}
