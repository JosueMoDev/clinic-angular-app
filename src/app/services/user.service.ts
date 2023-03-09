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
    return this.http.get(`${environment.THECLINIC_API_URL}/users?pagination=${from}`, this.headers).pipe(
      delay(200),
      map(
        (resp:any) => {
          const users = resp.users.map(
            ({ user_id, document_type, document_number, email, name,
              lastname, gender, phone, validationState, email_provider, rol, photo }: User) =>
              new User(user_id, document_type, document_number, email, name,
                lastname, gender, phone, validationState, email_provider, rol, photo)
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
