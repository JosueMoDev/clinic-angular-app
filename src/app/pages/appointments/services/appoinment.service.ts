import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Appointment as AppointmentModel } from 'src/app/models/appointment.model';
import {
  AppointmentResponse,
  Appointment,
} from '../interfaces/appointment-response.interface'
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly authenticationService = inject(AuthenticationService);
  public headers: {} = this.authenticationService.headers;
  constructor(private http: HttpClient) {}

  getAllAppointments() {
    return this.http
      .get<AppointmentResponse>(
        `${environment.THECLINIC_API_URL}/appointment/find-many`,
        this.headers
      )
      .pipe(
        delay(200),
        map((resp) => {
          const appointments = resp.appointments.map(
            (appointment) =>
              new AppointmentModel(appointment)
          );
          return {
            total: resp.pagination.total,
            appointments,
          };
        })
      );
  }
  createNewAppointment(appointment: any) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/appointments`,
      appointment,
      this.headers
    );
  }

  editAppointment(id: string, appointment: any) {
    return this.http.put(
      `${environment.THECLINIC_API_URL}/appointments/${id}`,
      appointment,
      this.headers
    );
  }

  deleteAppointment(id: string, userLogged: string) {
    return this.http.delete(
      `${environment.THECLINIC_API_URL}/appointments/${id}?user=${userLogged}`,
      this.headers
    );
  }
}
