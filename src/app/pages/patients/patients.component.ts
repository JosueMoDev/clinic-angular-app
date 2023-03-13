import { Component } from '@angular/core';
import { Dialog} from '@angular/cdk/dialog';
import { PatientService } from 'src/app/services/patient.service';
import { RegisterClinicComponent } from '../components/register-clinic/register-clinic.component';
import { Patient } from 'src/app/models/patient.model';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';
import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styles: [
  ]
})
export class PatientsComponent {
  public uiSubscription!: Subscription;
  public totalPatients: number = 0;
  public patientList: Patient[] = [];
  public dataTemp: Patient[] = [];
  public from: number = 0;


  constructor(
    private patientService: PatientService,
    public dialog: Dialog,
    public updateProfileService: UpdateProfileService,
    private store : Store <AppState>
  ) { }

  ngOnInit(): void {
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
  openDialog(): void {

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
          this.totalPatients = total;
        }
      )
  }
  patientPagination( from: number) {
    this.from += from;
    if (this.from < 0) {
      this.from = 0
    } else if (this.from >=this.totalPatients ) {
      this.from-=from
    }
    this.allPatients()
  }
  
  
}
