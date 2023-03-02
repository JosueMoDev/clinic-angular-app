import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UserRegisterForm } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }
  

  error(error: string) {
    return Swal.fire({
    icon: 'error',
    title: error,
    showConfirmButton: false,
    timer:2000
    })
  }
  
  get success() {
    return Swal.fire({
      icon: 'success',
      title: 'Patient has enrolled successfull',
      showConfirmButton: false,
      timer:2000
    })
  }

  crearteNewPatientWithEmailAndPassword(patient: UserRegisterForm) { 
    // const token = sessionStorage.getItem('the_clinic_session_token') || ''
    // { headers: { 'x-token': token }, user}
    return this.http.post(`${environment.THECLINIC_API_URL}/register/patient`, patient).subscribe(resp => { 
      if (resp) {this.success}
    }, (err) => {this.error(err.error.message)});
  }
  crearteNewPatientWithEmailAndPasswordOutside(patient: UserRegisterForm) { 
    // const token = sessionStorage.getItem('the_clinic_session_token') || ''
    // { headers: { 'x-token': token }, user}
    return this.http.post(`${environment.THECLINIC_API_URL}/register/patient/outside`, patient).subscribe(resp => { 
      if (resp) { this.success }
    }, (err)=>{this.error(err.error.message)});
  }
}
