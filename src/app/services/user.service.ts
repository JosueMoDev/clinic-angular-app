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
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user).subscribe(resp => { 
      console.log(resp)
    }, (err)=> console.warn(err.error.message));
  }

  
}
