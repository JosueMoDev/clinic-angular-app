import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(
    private http: HttpClient
  ) { }


  createClinic(formData:any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/clinics`, formData)
  }
}
