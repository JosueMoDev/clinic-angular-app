import { Component } from '@angular/core';
import { Dialog} from '@angular/cdk/dialog';
import { PatientService } from 'src/app/services/patient.service';
import { RegisterClinicComponent } from '../components/register-clinic/register-clinic.component';
import { Patient } from 'src/app/models/patient.model';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styles: [
  ]
})
export class PatientsComponent {

  public totalPatients: number = 0;
  public patientList: Patient[] = [];
  public dataTemp: Patient[] = [];
  public from: number = 0;
  public loading: boolean = true;
  
  

  constructor(
    private patientService: PatientService,
    public dialog: Dialog,
  ) { }

  ngOnInit(): void {
    this.allPatients()
  }


  openDialog(): void {

    this.dialog.open(ModalUserRegisterComponent, {
      width: '100vh',
      minWidth: '100vh',
      backdropClass:'top'
    });
  } 


  allPatients() {
    this.loading = true;
    this.patientService.allPatients(this.from)
      .subscribe(
        ({ patients, total }) => {
          this.patientList = patients;
          this.dataTemp = patients;
          this.totalPatients = total;
          this.loading = false
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
