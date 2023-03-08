import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';
import { delay, map } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }
  

  allUsers(from: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/users?pagination=${from}`).pipe(
      delay(200),
      map(
        (resp:any) => {
          const users = resp.users.map(
            ({ email, rol, name, lastname, user_id, document_number, photo}:User)=> new User(email, rol, name, lastname, user_id, document_number, photo)
          );
          return {
            total: resp.total,
            users
          }
     })
  )
  }
  crearteNewUserWithEmailAndPassword(user: UserRegisterForm) { 
    // const token = sessionStorage.getItem('the_clinic_session_token') || ''
    // { headers: { 'x-token': token }, user}
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user)
  }
  
}
