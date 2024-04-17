import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Account, Account as AccountModel } from 'src/app/models/account.model';
import { delay, map, Observable } from 'rxjs';
import { AccountResponse } from '../../../interfaces/account-response.interface';
import { Pagination } from 'src/app/interfaces';
import { Router } from '@angular/router';
interface ChangePassword {
  account: string;
  oldPassword: string;
  newPassword: string;
}
@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly http = inject(HttpClient);
  private readonly headers = this.authenticationService.headers;
  private _selectedAccount = signal<Account | null>(null);
  public selectedAccount = computed(() => this._selectedAccount());
  private readonly router = inject(Router)

  constructor() {}

  crearteNewAccount(account: Account) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/account/create`,
      account,
      this.headers
    );
  }

  getAllAccounts(
    page: number,
    pageSize: number
  ): Observable<{
    pagination: Pagination;
    accounts: AccountModel[];
  }> {
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

  set refreshAccount(account: Account) {
    this._selectedAccount.set(account);
  }
  
  updateAccount(account: Account) {
    console.log(account)
     return this.http.patch(
       `${environment.THECLINIC_API_URL}/account/update`,
       account,
       this.headers
     );
  }

  changePassword(chagePassword: ChangePassword) {
    return this.http.patch(
      `${environment.THECLINIC_API_URL}/account/change-password`,
      chagePassword,
      this.headers
    );
  }

  showAccount(account: Account) {
    this._selectedAccount.set(account);
    sessionStorage.setItem('account-selected', JSON.stringify(account));
    if (sessionStorage.getItem('account-selected')) this.router.navigateByUrl('/dashboard/show-account');
  }

  changeAccountStatus() {}
}
