import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';
import { AuthService } from './auth.service';
import { delay, map } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  public headers : {} = this.authService.headers
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allPatients(from: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/patients?pagination=${from}`, this.headers).pipe(
      delay(200),
      map(
        (resp:any) => {
          const patients = resp.patients.map(
            ({ email, name, lastname, patient_id, document_number, register_by, photo}:Patient)=> new Patient(email,  name, lastname, patient_id, document_number, register_by, photo)
          );
          return {
            total: resp.total,
            patients
          }
     })
  )
  }
  crearteNewPatientWithEmailAndPassword(patient: UserRegisterForm) { 
    return this.http.post(`${environment.THECLINIC_API_URL}/patients`, patient, this.headers)
  }
  crearteNewPatientWithEmailAndPasswordOutside(patient: UserRegisterForm) { 
    return this.http.post(`${environment.THECLINIC_API_URL}/patients/outside`, patient)
  }
}
