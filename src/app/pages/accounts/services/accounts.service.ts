import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Account as AccountModel } from 'src/app/models/account.model';
import { delay, map } from 'rxjs';
import { Account } from 'src/app/authentication/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly http = inject(HttpClient);
  private readonly headers = this.authenticationService.headers;
  constructor() {}

  crearteNewAccount(account: any) {
    console.log(account)
    return this.http.post(
      `${environment.THECLINIC_API_URL}/account/create`,
      account,
      this.headers
    );
  }

  allUsers(from: number) {
    return this.http
      .get<Account[]>(
        `${environment.THECLINIC_API_URL}/account/find-many?pagination=${from}`,
        this.headers
      )
      .pipe(
        delay(200),
        map(({ accounts, pagination }: any) => {
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
}
