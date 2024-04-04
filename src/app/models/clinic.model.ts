import {
  Address,
  LastUpdate,
} from '../pages/clinics/interface/clinic-response.interface';

export class Clinic {
  constructor(
    public id: string,
    public registerNumber: string,
    public name: string,
    public phone: string,
    public address: Address,
    public photoId: string,
    public photoUrl: string,
    public createdAt: Date,
    public createdBy: string,
    public status: boolean,
    public lastUpdate: LastUpdate[]
  ) {}
}
