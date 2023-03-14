import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { delay, map } from 'rxjs';
import { Clinic } from '../models/clinic.model';

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
        (resp:any) => {
          const clinics = resp.clinics.map(
            ({ clinic_id, register_number, name, phone,  province, city, street, register_by, photo}:Clinic)=> new Clinic( clinic_id, register_number, name, phone, province, city, street, register_by, photo)
          );
          return {
            total: resp.total,
            clinics
          }
     })
  )
  }


  createClinic(clinic:any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/clinics`, clinic, this.headers)
  }

  updateClinic(clinic: any, clinic_id:string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/${clinic_id}`, clinic, this.headers)
  }
}
