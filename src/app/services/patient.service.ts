import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }
  
  crearteNewPatientWithEmailAndPassword(patient: UserRegisterForm) { 
    // const token = sessionStorage.getItem('the_clinic_session_token') || ''
    // { headers: { 'x-token': token }, user}
    return this.http.post(`${environment.THECLINIC_API_URL}/register/patient`, patient).subscribe(resp => { 
      console.log(resp)
    }, (err)=> console.warn(err.error.message));
  }
}
