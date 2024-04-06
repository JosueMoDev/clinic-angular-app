import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Appointment as AppointmentModel } from 'src/app/models/appointment.model';
import { AuthenticationService } from '../authentication/services/authentication.service';
import {
  AppointmentResponse,
  Appointment,
} from '../pages/appointments/interfaces/appointment-response.interface';

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
            ({
              id,
              startDate,
              endDate,
              doctorId,
              patientId,
              createdAt,
              createdBy,
              lastUpdate,
            }: Appointment) =>
              new AppointmentModel(
                id,
                startDate,
                endDate,
                doctorId,
                patientId,
                createdAt,
                createdBy,
                lastUpdate
              )
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
