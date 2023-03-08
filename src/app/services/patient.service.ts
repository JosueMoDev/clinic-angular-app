import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  public headers : {} = this.authService.headers
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  crearteNewPatientWithEmailAndPassword(patient: UserRegisterForm) { 
    return this.http.post(`${environment.THECLINIC_API_URL}/register/patient`, patient, this.headers)
  }
  crearteNewPatientWithEmailAndPasswordOutside(patient: UserRegisterForm) { 
    return this.http.post(`${environment.THECLINIC_API_URL}/register/patient/outside`, patient)
  }
}
