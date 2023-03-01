import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/auth.interface';
import { tap, map, Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private _ngZone: NgZone
  ) { }
  logout() {
    sessionStorage.removeItem('the_clinic_session_token');
    google.accounts.id.revoke('jonasjosuemoralese@gmail.com', () => { 
      this._ngZone.run(() => { this.router.navigateByUrl('/login') })
    })
  }

  loginWithEmailAndPassword(loginForm: LoginForm, currentRoute: string) {
    console.log(currentRoute);
    if (currentRoute === '/login/patient') { 
      
      return this.http.post(`${environment.THECLINIC_API_URL}/login/patient`, loginForm)
      .pipe(tap( (resp: any ) => { 
        sessionStorage.setItem('the_clinic_session_token', resp.token),
        console.log( 'funciona')

      }));
    }
   
    return this.http.post(`${environment.THECLINIC_API_URL}/login`, loginForm)
      .pipe(tap( (resp: any ) => { 
        sessionStorage.setItem('the_clinic_session_token', resp.token),
        console.log( 'siempre paso por aqwi')
    }));
    
  }

  googleSingIn(token: string, currentRoute:string) { 
    console.log(currentRoute);
    if (currentRoute === '/login/patient') {
      return this.http.post(`${environment.THECLINIC_API_URL}/login/google/patient`, { token })
        .pipe(tap((resp: any) => {
          sessionStorage.setItem('the_clinic_session_token', resp.token),
          console.log( 'funciona')
        }));
    }
    return this.http.post(`${environment.THECLINIC_API_URL}/login/google`, { token })
    .pipe(tap((resp: any) => {
      sessionStorage.setItem('the_clinic_session_token', resp.token),
      console.log( 'siempre paso por aqwi')
    }));
  }
  isValidToken(): Observable<boolean> {
    const token = sessionStorage.getItem('the_clinic_session_token') || ''
    return this.http.get(`${environment.THECLINIC_API_URL}/login/renew`, { headers: { 'x-token': token } })
      .pipe(
        tap((resp: any) => { 
          sessionStorage.setItem('the_clinic_session_token', resp.token)
      }),
        map(resp => true),
      catchError( error => of(false))
    )
  }


}
