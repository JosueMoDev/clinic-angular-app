import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }
  

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
  crearteNewUserWithEmailAndPassword(user: UserRegisterForm) { 
    // const token = sessionStorage.getItem('the_clinic_session_token') || ''
    // { headers: { 'x-token': token }, user}
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user).subscribe(resp => { 
      if(resp){ this.success }
    }, (err)=>this.error(err.error.message));
  }

  
}
