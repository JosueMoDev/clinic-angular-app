import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/user.interface';
import { tap, map, Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }
  
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

  crearteNewUserWithEmailAndPassword(user: User) { 
    return this.http.post(`${environment.THECLINIC_API_URL}/users`, user).subscribe(res => { 
      console.log('usuario creado', res)
    }, (err)=> console.warn(err));
  }

  loginWithEmailAndPassword(loginForm: LoginForm) {
    return this.http.post(`${environment.THECLINIC_API_URL}/login`, loginForm)
      .pipe(tap( (resp: any ) => { 
        sessionStorage.setItem('the_clinic_session_token', resp.token)
      }));
    
  }

  googleSingIn(token: string) { 

    return this.http.post(`${environment.THECLINIC_API_URL}/login/google`, { token })
    .pipe(tap( (resp: any ) => { 
      sessionStorage.setItem('the_clinic_session_token', resp.token)
    }));
  }
}
