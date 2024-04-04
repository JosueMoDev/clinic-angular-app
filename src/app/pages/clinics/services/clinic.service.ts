import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Clinic as ClinicModel } from 'src/app/models/clinic.model';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { ClinicAvailableToMakeAnAppointment } from 'src/app/interfaces/clinic-available.interface';
import { Clinic, ClinicResponse } from '../interface/clinic-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
    private readonly http = inject(HttpClient);
    private readonly authenticationService = inject(AuthenticationService);
  public headers: {} = this.authenticationService.headers;

  constructor() {}

  allClinics(from: number) {
    return this.http
      .get<ClinicResponse>(
        `${environment.THECLINIC_API_URL}/clinic/find-many?pagination=${from}`,
        this.headers
      )
      .pipe(
        delay(200),
        map((resp: any) => {
          const clinics = resp.clinics.map(
            ({
              id,
              registerNumber,
              name,
              phone,
              address,
              photoUrl,
              photoId,
              createdAt,
              createdBy,
              status,
              lastUpdate,
            }: Clinic) =>
              new ClinicModel(
                id,
                registerNumber,
                name,
                phone,
                address,
                photoUrl,
                photoId,
                createdAt,
                createdBy,
                status,
                lastUpdate
              )
          );
          return {
            total: resp.total,
            clinics,
          };
        })
      );
  }
  allClinicsAvailableToMakeAnAppointment() {
    return this.http
      .get(
        `${environment.THECLINIC_API_URL}/appointments/clinic-available`,
        this.headers
      )
      .pipe(
        delay(200),
        map((resp: any) => {
          const clinics = resp.clinics.map(
            ({
              clinic_id,
              register_number,
              name,
              province,
              city,
            }: ClinicAvailableToMakeAnAppointment) => ({
              clinic_id,
              register_number,
              name,
              province,
              city,
            })
          );
          return {
            clinics,
          };
        })
      );
  }

  createClinic(clinic: any) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/clinics`,
      clinic,
      this.headers
    );
  }

  updateClinic(clinic: any, clinic_id: string) {
    return this.http.put(
      `${environment.THECLINIC_API_URL}/clinics/${clinic_id}`,
      clinic,
      this.headers
    );
  }

  changeClinicStatus(clinic_to_change: string, user_logged: string) {
    return this.http.put(
      `${environment.THECLINIC_API_URL}/clinics/delete/${clinic_to_change}`,
      { user_logged },
      this.headers
    );
  }
}
