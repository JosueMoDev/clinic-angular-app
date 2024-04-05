import { LastUpdate } from '../pages/appointments/interfaces/appointment-response.interface';
export class Appointment {
  constructor(
    public id: string,
    public startDate: Date,
    public endDate: Date,
    public doctorId: string,
    public patientId: string,
    public createdAt: Date,
    public createdBy: string,
    public lastUpdate: LastUpdate[]
  ) {}
}
