import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { delay, map } from 'rxjs';
import { Appointment } from '../models/appointment.model';

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
  getAllAppointments() {
    return this.http.get(`${environment.THECLINIC_API_URL}/appointments`, this.headers).pipe(
      delay(200),
      map(
        (resp:any) => {
          const appointments = resp.appointments.map(
            ({appointment_id, start, end, title, clinic, doctor, patient, createdby}: Appointment) =>
              new Appointment(appointment_id, new Date(start), new Date(end), title, clinic, doctor, patient, createdby)
          );
          return {
            total: resp.total,
            appointments
          }
     })
    )
  }
}
