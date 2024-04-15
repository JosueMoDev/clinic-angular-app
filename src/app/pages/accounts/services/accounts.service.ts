import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Account as AccountModel } from 'src/app/models/account.model';
import { delay, map } from 'rxjs';
import { Account } from 'src/app/authentication/interfaces';
import { AccountResponse } from '../interfaces/account-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly http = inject(HttpClient);
  private readonly headers = this.authenticationService.headers;
  constructor() {}

  crearteNewAccount(account: any) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/account/create`,
      account,
      this.headers
    );
  }

  getAllAccounts(page: number, pageSize: number) {
    return this.http
      .get<AccountResponse>(
        `${environment.THECLINIC_API_URL}/account/find-many?page=${page}&pageSize=${pageSize}`,
        this.headers
      )
      .pipe(
        delay(200),
        map(({ accounts, pagination }) => {
          const users = accounts.map(
            (account: Account) =>
              new AccountModel(
                account.id,
                account.duiNumber,
                account.email,
                account.name,
                account.lastname,
                account.gender,
                account.phone,
                account.isValidated,
                account.role,
                account.photoUrl
              )
          );
          return {
            total: pagination.total,
            users,
          };
        })
      );
  }

  updateAccount() {}

  changePassword() {}

  changeAccountStatus() {}
}
