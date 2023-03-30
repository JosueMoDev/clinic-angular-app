import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Clinic } from 'src/app/models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allClinics(from: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/clinics?pagination=${from}`, this.headers).pipe(
      delay(200),
      map(
        (resp: any) => {
          const clinics = resp.clinics.map(
            ({ clinic_id, register_number, name, phone, province, city, street, register_by, validationState, photo, doctors_assigned }: Clinic) =>
              new Clinic(clinic_id, register_number, name, phone, province, city, street, register_by, validationState, photo, doctors_assigned)
          );
          return {
            total: resp.total,
            clinics
          }
        })
    )
  }

  allClinicForAppointments() {
    return this.http.get(`${environment.THECLINIC_API_URL}/clinics/appointments`, this.headers)
  }

  assignDoctorsToClinic(clinic_id: string, doctors_assigned: string[]) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/assignment/${clinic_id}`, { doctors_assigned }, this.headers)
  }


  removeAllDoctorsAssignedToClinic(clinic_id: string, doctors_assigned: string[]) {

    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/remove-all-assigned/${clinic_id}`, { doctors_assigned }, this.headers)
  }

  removeADoctorAssignedToClinic(clinic_id: string, doctor_remove: string, doctors_assigned: string[]) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/remove-doctor-assigned/${clinic_id}`, { doctor_remove, doctors_assigned }, this.headers)
  }

  createClinic(clinic: any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/clinics`, clinic, this.headers)
  }

  updateClinic(clinic: any, clinic_id: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/${clinic_id}`, clinic, this.headers)
  }

  changeClinicStatus(clinic_to_change: string, user_logged: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/delete/${clinic_to_change}`, { user_logged }, this.headers)
  }
}
