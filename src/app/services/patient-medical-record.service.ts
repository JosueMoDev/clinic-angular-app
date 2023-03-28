import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientMedicalRecordService {

  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  createMedicalRecord(patient: string, medical_record: string, document_number: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/patients/save-medical-record/${patient}`,
    { document_number, medical_record }, this.headers);
  }
}
