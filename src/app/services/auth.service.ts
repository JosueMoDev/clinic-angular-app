import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/auth.interface';
import { tap, map, Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserLogged!: User;
  constructor(
    private http: HttpClient,
    private router: Router,
    private _ngZone: NgZone
  ) { }

  get token(): string {
    return sessionStorage.getItem('the_clinic_session_token') || '';
  }

  
  get headers() {
    return {
      headers: {
        'x-token': this.token
      },
    }
  }

  logout() {
    sessionStorage.removeItem('the_clinic_session_token');
    google.accounts.id.revoke('jonasjosuemoralese@gmail.com', () => { 
      this._ngZone.run(() => { this.router.navigateByUrl('/login') })
    })
  }

  loginWithEmailAndPassword(loginForm: LoginForm, currentRoute: string) {
    if (currentRoute === '/login/patient') { 
      return this.http.post(`${environment.THECLINIC_API_URL}/login/patient`, loginForm)
      .pipe(tap( (resp: any ) => { sessionStorage.setItem('the_clinic_session_token', resp.token)}));
    }
   
    return this.http.post(`${environment.THECLINIC_API_URL}/login`, loginForm)
      .pipe(tap( (resp: any ) => { sessionStorage.setItem('the_clinic_session_token', resp.token)}));
    
  }

  userLogged(userLogged: User) { 
    const { email, rol, name, lastname, user_id, document_number, photo} = userLogged
    this.currentUserLogged = new User( email, rol, name, lastname, user_id, document_number, photo)
  }

  googleSingIn(token: string, currentRoute:string) { 
    if (currentRoute === '/login/patient') {
      return this.http.post(`${environment.THECLINIC_API_URL}/login/google/patient`, { token })
        .pipe(tap((resp: any) => { sessionStorage.setItem('the_clinic_session_token', resp.token)}));
    }
    return this.http.post(`${environment.THECLINIC_API_URL}/login/google`, { token })
      .pipe(tap((resp: any) => {sessionStorage.setItem('the_clinic_session_token', resp.token)}));
  }
  isValidToken(): Observable<boolean> {
    return this.http.get(`${environment.THECLINIC_API_URL}/login/renew`, this.headers)
      .pipe(
        tap((resp: any) => { 
          if (resp.ok) {
            this.userLogged(resp.user)
            sessionStorage.setItem('the_clinic_session_token', resp.token)
          }
      }),
        map(resp => true),
      catchError( error => of(false))
    )
  }


}
