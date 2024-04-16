import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Account as AccountModel } from 'src/app/models/account.model';
import { delay, map, Observable } from 'rxjs';
import { Account, AccountResponse } from '../../../interfaces/account-response.interface';
import { Pagination } from 'src/app/interfaces';

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

  getAllAccounts(page: number, pageSize: number): Observable<{
    pagination: Pagination;
    accounts: AccountModel[];
}>{
    return this.http
      .get<AccountResponse>(
        `${environment.THECLINIC_API_URL}/account/find-many?page=${page}&pageSize=${pageSize}`,
        this.headers
      )
      .pipe(
        delay(200),
        map(({ accounts, pagination }) => {
          const accounstMapped = accounts.map(
            (account: Account) => new AccountModel(account)
          );
          return {
            pagination,
            accounts: accounstMapped,
          };
        })
      );
  }

  updateAccount() {}

  changePassword() {}

  changeAccountStatus() {}
}
