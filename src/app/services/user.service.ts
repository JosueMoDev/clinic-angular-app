import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }
  

  
  crearteNewUserWithEmailAndPassword(user: UserRegisterForm) { 
    // const token = sessionStorage.getItem('the_clinic_session_token') || ''
    // { headers: { 'x-token': token }, user}
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user)
  }
  
}
