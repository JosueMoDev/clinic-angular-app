import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserRegisterForm } from 'src/app/interfaces/user.interface';
import { User } from 'src/app/models/user.model';

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
      map((resp: any) => {
        const users = resp.users.map(
          ({ id, document_type, document_number, email, name,
            lastname, gender, phone, validationState, email_name, email_provider, rol, photo }: User) =>
            new User(id, document_type, document_number, email, name,
              lastname, gender, phone, validationState, email_name, email_provider, rol, photo)
        );
        return {
          total: resp.total,
          users
        }
      })
    );
  }

  allEmployesAviblesToAssign(clinic: string) {
    return this.http.get(`${environment.THECLINIC_API_URL}/users/doctors?clinic=${clinic}`, this.headers).pipe(
      delay(200),
      map((resp: any) => {
        const doctors_assigned = resp.doctors_assigned.map(
          ({ id, document_type, document_number, email, name,
            lastname, gender, phone, validationState, email_name, email_provider, rol, photo }: User) =>
            new User(id, document_type, document_number, email, name,
              lastname, gender, phone, validationState, email_name, email_provider, rol, photo)
        );
        const doctors_avilable = resp.doctors_avilable.map(
          ({ id, document_type, document_number, email, name,
            lastname, gender, phone, validationState, email_name, email_provider, rol, photo }: User) =>
            new User(id, document_type, document_number, email, name,
              lastname, gender, phone, validationState, email_name, email_provider, rol, photo)
        );
        return {
          doctors_assigned,
          doctors_avilable
        }
      })
    );
  }

  crearteNewUserWithEmailAndPassword(user: UserRegisterForm) {
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user, this.headers);
  }

  updateUser(user: any, id: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/users/${id}`, user, this.headers);
  }

  changeUserStatus(user_to_change: string, user_logged: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/users/delete/${user_to_change}`, { user_logged }, this.headers);
  }

  confirmateOldPassword(user: string, oldPassword: string) {
    return this.http.post(`${environment.THECLINIC_API_URL}/users/confirm-password/${user}`, { oldPassword }, this.headers);
  }

  changePassword(user: string, newPassword: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/users/change-password/${user}`, { newPassword }, this.headers);
  }

}
