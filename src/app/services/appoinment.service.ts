import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppoinmentService {
  public headers : {} = this.authService.headers
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createNewAppointment(appointment: any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/appointments`, appointment, this.headers)
  }
}
