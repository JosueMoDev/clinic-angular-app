import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable, catchError, of, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LoginForm } from 'src/app/interfaces/auth.interface';
import { Account, LoggedAccount } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly baseUrl: string = environment.THECLINIC_API_URL;
  private http = inject(HttpClient);

  private _currentUserLogged = signal<Account | null>(null);
  public currentUserLogged = computed(() => this._currentUserLogged());

  constructor() {}
  get token(): string {
    return sessionStorage.getItem('the_clinic_session_token') || '';
  }

  get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }
  get userRol() {
    return this.currentUserLogged()?.role;
  }
  logout() {}

  private setAuthentication(account: Account, accessToken: string): boolean {
    this._currentUserLogged.set(account);
    sessionStorage.setItem('the_clinic_session_token', accessToken);
    return true;
  }

  loginWithEmailAndPassword(loginForm: LoginForm) {
    return this.http
      .post<LoggedAccount>(`${this.baseUrl}/authentication/login`, loginForm)
      .pipe(
        map(({ account, accessToken }) =>
          this.setAuthentication(account, accessToken)
        ),
        catchError((err) => throwError(() => err.error.message))
      );
  }

  isValidToken() {
    const token = sessionStorage.getItem('the_clinic_session_token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<LoggedAccount>(`${this.baseUrl}/authentication/refresh-token`, {
        headers,
      })
      .pipe(
        map(({ account, accessToken }) =>
          this.setAuthentication(account, accessToken)
        ),
        catchError((err) =>
          throwError(() => {
            err.error.message;
            return of(false);
          })
        )
      );
  }
}
