import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserRegisterForm } from 'src/app/interfaces/user.interface';

import { AuthService } from './auth.service';
import { Account } from '../authentication/interfaces';
import { Account as AccountModel } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public headers: {} = this.authService.headers;

  constructor(private http: HttpClient, private authService: AuthService) {}

  allUsers(from: number) {
    return this.http
      .get<Account[]>(
        `${environment.THECLINIC_API_URL}/account/find-many?pagination=${from}`,
        this.headers
      )
      .pipe(
        delay(200),
        map(({accounts, pagination} : any) => {
          const users = accounts.map(
            ({
              id,
              duiNumber,
              email,
              name,
              lastname,
              gender,
              phone,
              isValidated,
              role,
              photoUrl,
            }: Account) =>
              new AccountModel(
                id,
                duiNumber,
                email,
                name,
                lastname,
                gender,
                phone,
                isValidated,
                role,
                photoUrl
              )
          );
          return {
            total: pagination.total,
            users,
          };
        })
      );
  }

  updateUser(user: any, id: string) {
    return this.http.put(
      `${environment.THECLINIC_API_URL}/users/${id}`,
      user,
      this.headers
    );
  }

  changeUserStatus(user_to_change: string, user_logged: string) {
    return this.http.put(
      `${environment.THECLINIC_API_URL}/users/delete/${user_to_change}`,
      { user_logged },
      this.headers
    );
  }

  confirmateOldPassword(user: string, oldPassword: string) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/users/confirm-password/${user}`,
      { oldPassword },
      this.headers
    );
  }

  changePassword(user: string, newPassword: string) {
    return this.http.put(
      `${environment.THECLINIC_API_URL}/users/change-password/${user}`,
      { newPassword },
      this.headers
    );
  }
}
