import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { environment } from 'src/environments/environment';
import { delay, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetDoctorsAvilableResponse } from '../interfaces/get-doctors-avilable.interface';
import { Account } from 'src/app/authentication/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ClinicAssigmentService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly http = inject(HttpClient);

  public headers: {} = this.authenticationService.headers;
  getDoctorsAvilableToAssign() {
    return this.http
      .get<Account[]>(
        `${environment.THECLINIC_API_URL}/clinic-assignment/assignable-doctors`,
        this.headers
      )
      .pipe(
        delay(200),
        map((doctors) => {
          // TODO: se debe incluir la paginacion
          return doctors;
        })
      );
  }

  allEmployeesAssingedToClinic(clinic: string, from: number) {
    return this.http
      .get(
        `${environment.THECLINIC_API_URL}/clinic-assignments/all-assigned?clinic=${clinic}&pagination=${from}`,
        this.headers
      )
      .pipe(delay(200));
  }

  allDoctorsAvailableToMakeAnAppointment(clinic: string) {
    // return this.http
    //   .get(
    //     `${environment.THECLINIC_API_URL}/clinic-assignments/doctors-available/${clinic}`,
    //     this.headers
    //   )
    //   .pipe(
    //     delay(200),
    //     map((resp: any) => {
    //       const doctors = resp.doctors.map(
    //         ({ id, name, lastname, photo }: DoctorAvailable) => ({
    //           id,
    //           name,
    //           lastname,
    //           photo,
    //         })
    //       );
    //       return { doctors };
    //     })
    //   );
  }

  assignDoctorsToClinic(clinic_id: string, doctors_assigned: string[]) {
    return this.http
      .post<any>(
        `${environment.THECLINIC_API_URL}/clinic-assignment/create`,
        { doctors: doctors_assigned, clinic: clinic_id },
        this.headers
      )
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  removeAllDoctorsAssignedToClinic(clinic_id: string) {
    return this.http.delete(
      `${environment.THECLINIC_API_URL}/clinic-assignments/remove-all/${clinic_id}`,
      this.headers
    );
  }

  removeADoctorAssignedToClinic(
    reference: string,
    clinic_id: string,
    doctor_id: string
  ) {
    return this.http.delete(
      `${environment.THECLINIC_API_URL}/clinic-assignments/remove-one/${reference}?clinic=${clinic_id}&doctor=${doctor_id}`,
      this.headers
    );
  }
}
