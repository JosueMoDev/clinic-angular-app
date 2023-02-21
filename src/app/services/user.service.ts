import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient ) { }
  
  crearteNewUserWithEmailAndPassword(user: User) { 

    console.log( user)
    return this.http.post(`${environment.api_url}/users`, user).subscribe(res => { 
      console.log('usuario creado', res)
    }, (err)=> console.warn(err));
  }
}
