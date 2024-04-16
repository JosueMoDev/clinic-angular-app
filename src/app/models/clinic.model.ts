import { LastUpdate } from '../interfaces';
import { Address } from '../interfaces/clinic-response.interface';

export class Clinic {
  public id: string;
  public registerNumber: string;
  public name: string;
  public phone: string;
  public address: Address;
  public photoId: string;
  public photoUrl: string;
  public createdAt: Date;
  public createdBy: string;
  public status: boolean;
  public lastUpdate: LastUpdate[];
  
  constructor(options: Clinic) {
    this.id = options.id;
    this.registerNumber = options.registerNumber;
    this.name = options.name;
    this.phone = options.phone;
    this.address = options.address;
    this.photoId = options.photoId;
    this.photoUrl = options.photoUrl;
    this.createdAt = options.createdAt;
    this.createdBy = options.createdBy;
    this.status = options.status;
    this.lastUpdate = options.lastUpdate;
  }
}
