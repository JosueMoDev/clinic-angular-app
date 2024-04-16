import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Clinic as ClinicModel } from 'src/app/models/clinic.model';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { ClinicAvailableToMakeAnAppointment } from 'src/app/interfaces/clinic-available.interface';
import {
  Clinic,
  ClinicResponse,
} from '../../../interfaces/clinic-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private readonly http = inject(HttpClient);
  private readonly authenticationService = inject(AuthenticationService);
  public headers: {} = this.authenticationService.headers;

  constructor() {}

  allClinics(page: number, pageSize: number) {
    return this.http
      .get<ClinicResponse>(
        `${environment.THECLINIC_API_URL}/clinic/find-many?page=${page}&pageSize=${pageSize}`,
        this.headers
      )
      .pipe(
        delay(200),
        map(({ clinics, pagination }) => {
          const clinicsList = clinics.map((clinic) => new ClinicModel(clinic));
          return {
            pagination,
            clinics: clinicsList,
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

  createClinic(clinic: Clinic) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/clinic/create`,
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
