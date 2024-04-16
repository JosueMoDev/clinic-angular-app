import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { environment } from 'src/environments/environment';
import { delay, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Account } from 'src/app/models/account.model';

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

  allEmployeesAssingedToClinic(clinic: string) {
    return this.http
      .get<Account[]>(
        `${environment.THECLINIC_API_URL}/clinic-assignment/assigned-doctors/${clinic}`,
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

  removeADoctorsAssignedToClinic(doctors: string[], clinic: string) {
    return this.http.post(
      `${environment.THECLINIC_API_URL}/clinic-assignment/delete`,
      { doctors, clinic },
      this.headers
    );
  }
}
