import { LastUpdate } from '../pages/appointments/interfaces/appointment-response.interface';


interface AppointmentOptions {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  doctorId: string;
  patientId: string;
  clinicId: string;
  createdAt: Date;
  createdBy: string;
  lastUpdate?: LastUpdate[];
}
export class Appointment {
  public id: string;
  public start: Date;
  public end: Date;
  public doctor: string;
  public patient: string;
  public clinic: string;
  public createdAt: Date;
  public createdBy: string;
  public lastUpdate?: LastUpdate[];
  constructor(options: AppointmentOptions) {
    this.id = options.id;
    this.start = new Date(options.startDate);
    this.end = new Date(options.endDate);
    this.doctor = options.doctorId;
    this.patient = options.patientId;
    this.clinic = options.clinicId
    this.createdAt = options.createdAt;
    this.createdBy = options.createdBy;
    this.lastUpdate = options.lastUpdate;
  }
}
