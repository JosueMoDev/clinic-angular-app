import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRegisterForm } from '../interfaces/user.interface';
import { delay, map } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allUsers(from: number) {
    console.log( this.headers)
    return this.http.get(`${environment.THECLINIC_API_URL}/users?pagination=${from}`, this.headers).pipe(
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
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user , this.headers)
  }
  
}
