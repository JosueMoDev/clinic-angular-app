import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Appointment  } from 'src/app/models/appointment.model';
import {
  AppointmentResponse,
} from '../interfaces/appointment-response.interface'
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly http = inject(HttpClient);
  public headers: {} = this.authenticationService.headers;
  constructor() {}

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
            (appointment) => new Appointment(appointment)
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
      `${environment.THECLINIC_API_URL}/appointment/create`,
      appointment,
      this.headers
    );
  }

  editAppointment(appointment: any) {
    return this.http.patch(
      `${environment.THECLINIC_API_URL}/appointment/update`,
      appointment,
      this.headers
    );
  }

  deleteAppointment(id: string) {
    return this.http.delete(
      `${environment.THECLINIC_API_URL}/appointment/delete/${id}`,
      this.headers
    );
  }
}
